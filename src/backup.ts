const mysqldump = require('mysqldump');
const fs = require('fs');
const path = require('path');
const { dbConfig } = require('./dbConfig');

export async function realizarCopiaDeSeguridad() {
  try {
    // Obtén la fecha y hora actual
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toISOString().replace(/:/g, '-').replace(/\./g, '-');

    // Nombre del archivo de copia de seguridad con fecha y hora
    const backupFileName = `ClinicaVeterinariaBD_BACK_${fechaFormateada}.sql`;

    // Ruta completa del directorio de copias de seguridad
    const backupDir = path.join(__dirname, 'backups');

    // Asegúrate de que el directorio de copias de seguridad exista
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    // Ruta completa del archivo de copia de seguridad (incluye el directorio)
    const backupFilePath = path.join(backupDir, backupFileName);

    // Configura las opciones para mysqldump
    const dumpOptions = {
      connection: {
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database.toLowerCase(),
      },
      dumpToFile: backupFilePath,
    };

    // Realiza la copia de seguridad
    await mysqldump(dumpOptions);

    console.log(`Copia de seguridad creada en: ${backupFilePath}`);
  } catch (error) {
    console.error('Error al crear la copia de seguridad:', error);
  }
}

// Llama a la función para crear la copia de seguridad
realizarCopiaDeSeguridad();
