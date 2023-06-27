const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define(
        "type",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
        },
        {
            timestamps: false, // para eliminar que se creen por defecto los campos de registro
        }
    );
};