async function handleForgot(e){
    try{
        e.preventDefault();
        console.log('forgot password pressed');
        const email = document.getElementById('email').value;
    
        const data = await axios.post('http://localhost:3000/password/forgotpassword',{
            email:email
        });
        console.log(data);
        if(data.status === 202){
            localStorage.setItem('objectId',data.data.objectId);
            document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
            window.location.href = './resetpassword.html'
            //document.body.innerHTML=(data.data);
        } else {
            throw new Error('Something went wrong!!!')
        }
    }
    catch(error){
        console.log(error,'error in handleForgot');
        document.body.innerHTML += `<div style="color:red;">${error} <div>`;
    }
};