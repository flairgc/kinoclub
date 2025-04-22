
export const userSchema = {
    $id: 'User',
    type: 'object',
    properties: {
        id:    { type: 'integer' },
        login: { type: 'string'  },
        email: { type: 'string', format: 'email' },
        name:  { type: 'string'  }
    },
    required: ['id', 'login', 'email', 'name']
};

// В будущем можно добавлять другие схемы здесь
// export const taskSchema = { $id: 'Task', ... };

// Экспортируем массив всех схем
export const schemas = [
    userSchema,
];
