import Database from 'better-sqlite3'

const createConnection = () => new Database('my-database.db')


const startTransaction = () =>{
    const conn = createConnection();
    conn.prepare('BEGIN TRANSACTION').run();
    return conn;

}

const commitTransaction = (conn) => {
    conn.prepare('COMMIT').run();
    conn.close();
    console.log('Connection closed.');
};

const rollbackTransaction = (conn) => {
    conn.prepare('ROLLBACK').run();
    conn.close();
    console.log('Connection closed.');
    
};
  

const exectTransacQuery = (conn,sql, params = []) => {
    return conn.prepare(sql).run(params);
};

const runTransacQuery = (conn,sql, params) =>{
    return conn.prepare(sql).all(params);
}

const execQuery = (sql, params = []) => {
    const conn = createConnection()
    try {
        return conn.prepare(sql).run(params);
    } finally {
        conn.close();
    }
};

const runQuery = (sql, params) =>{
    const conn = createConnection()
    try {
        return conn.prepare(sql).all(params);
    } finally {
        conn.close();
    }
}

export {
    startTransaction,
    commitTransaction,
    rollbackTransaction,
    exectTransacQuery,
    runTransacQuery,
    execQuery,
    runQuery
}