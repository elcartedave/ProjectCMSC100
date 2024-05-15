import axios from 'axios';
import React, { useEffect, useState } from 'react'


function UserList(){
    const [users, setUsers] = useState([]);

useEffect(()=>{
    axios.get('http://localhost:3001/userlist')
    .then((response)=>{
        setUsers(response.data);
        console.log(response);
    })
})

const deleteUser = (id) => {
    axios.post('http://localhost:3001/userlist', { id })
        .then((response) => {
            if (response.data.success) {
                setUsers(users.filter(user => user._id !== id));
            }
        })
        .catch((error) => {
            console.error('Error deleting user:', error);
        });
};




    return(
        <>
        <table>
            <tr>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Email</th>
                <th scope="col">User Type</th>
                <th scope="col">Delete Account</th>
            </tr>
            {
                users.map((user)=> {
                    return (
                        <tr key={user._id}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.userType}</td>
                            <td><button className="nav-btn" onClick={() => deleteUser(user._id) }>Delete</button></td>
                        </tr>
                    );
                })
            }
        </table>
        <p>Total Users: {users.length}</p>
        </>
    )
}

export default UserList

