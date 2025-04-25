export async function uploadUserAvatarRepo(supabase, bucket, { buffer, mimetype, fileName }) {

    const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, buffer, {
            contentType: mimetype,
        });

    if (error) {
        throw new Error(error.message)
    }
}

export function getUserAvatarLinkRepo(supabase, bucket, { fileName }) {
    const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
}
