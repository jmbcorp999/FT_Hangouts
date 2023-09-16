import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase('mydatabase.db');

export const initializeDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY NOT NULL, firstName TEXT, lastName TEXT, phone TEXT, email TEXT, address TEXT);',
    );
  });
};

export const createContact = contact => {
  return new Promise((resolve, reject) => {
    console.log('createContact', contact);
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO contacts (firstName, lastName, phone, email, address) VALUES (?, ?, ?, ?, ?)',
        [
          contact.firstName,
          contact.lastName,
          contact.phone,
          contact.email,
          contact.address,
        ],
        (_, {rowsAffected}) => {
          if (rowsAffected > 0) {
            console.log('Contact ajouté avec succès');
            resolve();
          } else {
            reject("Erreur d'insertion");
          }
        },
        (_, error) => {
          reject(error);
          return true;
        },
      );
    });
  });
};

export const fetchContacts = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM contacts',
        [],
        (_, result) => {
          let contactsArray = [];

          for (let i = 0; i < result.rows.length; i++) {
            contactsArray.push(result.rows.item(i));
          }

          resolve(contactsArray);
        },
        (_, error) => {
          console.log('error', error);
          reject(error);
          return true;
        },
      );
    });
  });
};

export const getContactById = (id: string) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM contacts WHERE id = ?',
        [id],
        (_, result) => {
          if (result.rows.length > 0) {
            resolve(result.rows.item(0)); // Retournez le premier (et unique) contact correspondant à cet ID
          } else {
            reject('Aucun contact trouvé avec cet ID');
          }
        },
        (_, error) => {
          reject(error);
          return true; // Cela indique que la transaction a échoué et doit être roulée en arrière
        },
      );
    });
  });
};

export const deleteContactById = (id: string) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM contacts WHERE id = ?',
        [id],
        (_, result) => {
          if (result.rowsAffected > 0) {
            resolve();
          } else {
            reject('Erreur lors de la suppression du contact');
          }
        },
        (_, error) => {
          reject(error);
          return true;
        },
      );
    });
  });
};

export const updateContactById = (id: string, updatedContact) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE contacts SET firstName = ?, lastName = ?, phone = ?, email = ?, address = ? WHERE id = ?',
        [
          updatedContact.firstName,
          updatedContact.lastName,
          updatedContact.phone,
          updatedContact.email,
          updatedContact.address,
          id,
        ],
        (_, result) => {
          if (result.rowsAffected > 0) {
            resolve();
          } else {
            reject('Erreur lors de la mise à jour du contact');
          }
        },
        (_, error) => {
          reject(error);
          return true;
        },
      );
    });
  });
};
