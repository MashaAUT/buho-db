import express from 'express';
import sql from 'mssql';

const app = express();
const port = 3000;

const config = {
    user: 'masha',
    password: 'Mash@1234',
    server: 'localhost',
    database: 'mashaDb',
    encrypt: true,
    options: {
        enableArithAbort: true
    }
};

app.get('/', (req, res) => {
    res.send('Hi there');
});

// Add a person with id, first_name, and last_name
app.get('/addPerson/:id/:first_name/:last_name', async (req, res) => {
    const { id, first_name, last_name } = req.params;

    try {
        await sql.connect(config);
        const request = new sql.Request();
        const query = `INSERT INTO people (person_id, first_name, last_name) VALUES (@id, @first_name, @last_name)`;
        
        // Using parameterized query to prevent SQL injection
        request.input('id', sql.Int, id);
        request.input('first_name', sql.VarChar, first_name);
        request.input('last_name', sql.VarChar, last_name);
        
        await request.query(query);
        res.send(`Added ${first_name} ${last_name} with ID ${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding person: ' + err.message);
    }
});

// Remove a person by id
app.get('/removePerson/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await sql.connect(config);
        const request = new sql.Request();
        const query = `DELETE FROM people WHERE person_id = @id`;
        
        // Using parameterized query to prevent SQL injection
        request.input('id', sql.Int, id);
        
        await request.query(query);
        res.send(`Removed person with ID ${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error removing person: ' + err.message);
    }
});

// Reset the database
app.get('/reset', async (req, res) => {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        const query = `DELETE FROM people WHERE person_id > 3`;
        
        await request.query(query);
        res.send('Reset database to default seed data.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error resetting database: ' + err.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});