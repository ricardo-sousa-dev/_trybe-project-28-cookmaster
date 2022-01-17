const { ObjectId } = require('mongodb');
const connect = require('./connection');

const existsVerifyName = async (name) => {
    const db = await connect();

    const userExists = await db.collection('users')
        .findOne({ name });

    return userExists;
};

const createUserModel = async (name, quantity) => {
    const db = await connect();

    const userInserted = await db.collection('users')
        .insertOne({ name, quantity })
        .then((result) => ({
            _id: result.insertedId,
            name,
            quantity,
        }));

    return userInserted;
};

const getUsersModel = async () => {
    const db = await connect();
    const users = await db.collection('users').find().toArray();
    console.log(users);
    return users;
};

const getUserIdModel = async (id) => {
    // https: //mongodb.github.io/node-mongodb-native/api-bson-generated/objectid.html#objectid-isvalid
    // https: //mongodb.github.io/node-mongodb-native/2.2/api/ObjectID.html
    if (!ObjectId.isValid(id)) return null;

    const db = await connect();
    const user = await db.collection('users').findOne({ _id: ObjectId(id) });

    return user;
};

const updateUserModel = async (id, name, quantity) => {
    const db = await connect();

    await db.collection('users')
        .updateOne({ _id: ObjectId(id) }, { $set: { name, quantity } });

    return getUserIdModel(id);
};

const deleteUserModel = async (id) => {
    const db = await connect();
    const response = await db.collection('users').deleteOne({ _id: ObjectId(id) });

    return response;
};

module.exports = {
    createUserModel,
    existsVerifyName,
    getUsersModel,
    getUserIdModel,
    updateUserModel,
    deleteUserModel,
};

// SQL: Busca todos os autores do banco.
// const getAll = async() => {
//     const [users] = await connection.execute(
//         'SELECT id, first_userName, middle_userName, last_userName FROM model_example.users;',
//     );
//     return users.map(serialize);
// };

// SQL: Busca um autor específico, a partir do seu ID
// const findById = async(id) => {
//     // Repare que substituímos o id por `?` na query.
//     // Depois, ao executá-la, informamos um array com o id para o método `execute`.
//     // O `mysql2` vai realizar de forma segura, a substituição do `?` pelo id informado, isso previne possíveis ataques de sql injection.
//     const query = 'SELECT id, first_userName, middle_userName, last_userName FROM model_example.users WHERE id = ?'
//     const [userData] = await connection.execute(query, [id]);

//     if (userData.length === 0) return null;

//     // Utilizamos [0] para buscar a primeira linha, que deve ser a única no array de resultados, pois estamos buscando por ID.
//     return serialize(userData[0]);
// };

// SQL: Cria um novo autor no banco.
// const create = async(userName,  userQuantity) => connection.execute(
//     'INSERT INTO model_example.users (first_userName, middle_userName, last_userName) VALUES (?,?,?)', [userName,  userQuantity],
// );