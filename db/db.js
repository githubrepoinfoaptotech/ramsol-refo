

const Sequelize= require("sequelize");

// const sequelize1=new Sequelize("jobportal","postgres","postgres",{
//     dialect:"postgres",
//     host:"3.14.9.124",
//     logging:false,
// });
// try {
//     sequelize1.authenticate();
//     console.log('Connection has been established successfully.');
//     } catch (error) {
//     console.error('Unable to connect to the database:', error);
//     }
    // const sequelize=new Sequelize("ramsol","ramsol","ramsolrefoapp#123",{
    //     dialect:"postgres",
    //     host:"refo-production-v1.ckzrrpsjwx6b.us-east-1.rds.amazonaws.com",
    //     logging:false,
    // });
    // try {
    //     sequelize.authenticate();
    //     console.log('Connection has been established successfully.');
    //     } catch (error) {
    //     console.error('Unable to connect to the database:', error);
    //     }
    const sequelize=new Sequelize("ramsol_refo","postgres","123456789",{
            dialect:"postgres",
            host:"localhost",
            logging:false,
        });
        try {
            sequelize.authenticate();
            console.log('Connection has been established successfully.');
            } catch (error) {
            console.error('Unable to connect to the database:', error);
            }

    //     const sequelize=new Sequelize("refo_production","postgres","123456789",{
    //     dialect:"postgres",
    //     host:"localhost",
    //     logging:false,
    // });
    // try {
    //     sequelize.authenticate();
    //     console.log('Connection has been established successfully.');
    //     } catch (error) {
    //     console.error('Unable to connect to the database:', error);
    //     }

module.exports=sequelize;


