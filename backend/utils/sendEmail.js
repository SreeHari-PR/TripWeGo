// const nodemailer=require('nodemailer')

// module.exports=async(email,subject,text)=>{
//     try {
//         const Transporter=nodemailer.createTransport({
//             host:process.env.HOST,
//             service:process.env.SERVICE,
//             port:Number(process.env.EMAIL_PORT),
//             secure:Boolean(process.env.SECURE),
//             auth:{
//                 user:process.env.USER,
//                 pass:process.env.PASS,
//             }
//         });
//     await Transporter.sendMail({
//         from:process.env.USER,
//         to:email,
//         subject:subject,
//         text:text,

//     });
//     console.log('Email sent Successfully');
//     } catch (error) {
//         console.log("Email not sent");
//         console.log(error);
//     }
// }
const nodemailer = require('nodemailer');

module.exports = async (email, subject, text) => {
    try {
       
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, 
            requireTLS: true, 
            auth: {
                user: 'pigabo40@gmail.com',
                pass: 'wvcv tpuo eqzo ghle', 
            },
        });
        await transporter.sendMail({
            from: 'pigabo40@gmail.com',
            to: email,
            subject: subject,
           text:text, 
        });

        console.log('Email sent successfully');
    } catch (error) {
        console.log('Email not sent');
        console.error(error);
    }
};
