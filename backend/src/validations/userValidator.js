const z = require('zod');

// 1. Esqueme para CREAR usuario (Todo es obligatorio menos id)

//Nota: Es muy similar al registro, pero lo separamos por si las reglas cambian (ej: admin puede crear usuarios sin clave inicial)

const createUserSchema = z.object({
    nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    
    email: z.string().email("El formato de correo invalido"),

    clave: z.string().min(6, 'La contraseña debe tener al menos de 6 caracteres'),

    id_rol: z.number().int().positive('El ID del rol debe ser un numero positivo')
})


// 2. Esquema para ACTUALIZAR usuario (Todo es opcional)
// Usamos .partial() para deicr "validame solo lo que venga, no exijas todo"
const updateUserSchema = createUserSchema.partial()

const validateCreateUser = (data) => {
    return createUserSchema.safeParse(data)
};

const validateUpdateUser = (data) => {
    return updateUserSchema.safeParse(data)
}

module.exports = {validateCreateUser, validateUpdateUser}