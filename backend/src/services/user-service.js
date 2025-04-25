import { v4 as uuidv4 } from 'uuid';
import { getUserAvatarLinkRepo, uploadUserAvatarRepo } from '../repositories/supabase-repository.js';
import { updateUserAvatarRepo } from '../repositories/user-repository.js';

export async function saveUserAvatar({ db, supabase, bucket, buffer, mimetype, userId }) {
    const fileName = uuidv4();

    await uploadUserAvatarRepo(
        supabase,
        bucket,
        { buffer, mimetype, fileName }
    )

    const avatarUrl = getUserAvatarLinkRepo(
        supabase,
        bucket,
        { fileName }
    );

    await updateUserAvatarRepo(db, userId, avatarUrl);

    return avatarUrl;
}
