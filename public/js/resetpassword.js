async function resetpasswordfile(event){
    event.preventDefault();
    console.log('reset password clicked')
    const objectId = localStorage.getItem('objectId');
    const password = document.getElementById('resetpassword').value;
    console.log(objectId,password)
    const data = await axios.post(`http://localhost:3000/password/updatepassword/${objectId}`,
    {
        newpassword:password
    });
    console.log(data,'data in resetpassword');
    alert('password Updated Successfully Login with new password .. redirecting you to login page in 1 second')
    setTimeout(() => {
        window.location.href ='./login.html'
    }, 1000);
}