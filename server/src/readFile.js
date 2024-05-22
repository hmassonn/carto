const fs = require('fs');

const fileReader = {
    asynchronously: (name) => {
        return new Promise((resolve, reject) => {
            fs.readFile(name, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (error) {
                    reject(error);
                }
            });
        });
    },

    synchronously: (name) => {
        try {
            const data = fs.readFileSync(name, 'utf8');
            const jsonData = JSON.parse(data);
            return jsonData;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = fileReader;
