const dbConnection = require('../connection/db')
const router = require('express').Router()

router.get('/login', function(req, res) {
    res.render('auth/login', {title: 'Login'})
})

router.get('/signup', function(req, res) {
    res.render('auth/signup', {title: 'Sign Up'})
})

router.post('/login', function(req, res) {
    const { user_id, email, password } = req.body
    const query = `SELECT user_id, email, password FROM user WHERE user_id = '${user_id}' AND email = '${email}' AND password = '${password}'`

    dbConnection.getConnection((err, conn) => {
        //if (err) throw err
        console.log('database error: ', err)
        conn.query(query, (err, results) => {
            console.log('database error: ', err)

                req.session.user = {
                    user_id: results[0].user_id,
                    name: results[0].name,
                    email: results[0].email
                }
                req.session.isLogin = true
                return res.redirect('/')
            
        })
        conn.release()
    })
})

router.post('/register', function(req, res) {
    
    const { name, email, password } = req.body

    if(name == '' || email == '' || password == '') {
        
        //send message
        req.session.message = {
            type: 'Danger',
            message: 'Please insert all field'
        }
        return res.redirect('/')
    }

    const query = `INSERT INTO user ( email, password, name) VALUES( '${name}', '${email}', '${password}')`

    dbConnection.getConnection((err, conn) =>{
        if (err) throw err
        conn.query(query, (err, results) => {

                req.session.message = {
                    type: 'Success',
                    message: 'Register account successfully'
                }
            return res.redirect('/')
        })
        conn.release()
    })
})


module.exports = router