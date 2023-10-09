import React from 'react'
import {Link} from 'react-router-dom'
import logo from '../Images/logo.png'
import logo2 from '../Images/matchy.png'
import {Icon} from 'react-icons-kit'
import {shoppingCart} from 'react-icons-kit/feather/shoppingCart'
import {auth} from '../Config/Config'
import {useHistory} from 'react-router-dom'

export const Navbar = ({user,totalProducts}) => {

    const history = useHistory();

    const handleLogout=()=>{
        auth.signOut().then(()=>{
            history.push('/');
        })
    }

    return (
        <div className='navbar'>
            <div className='leftside'>
                <div className='logo'>
                    <Link className='navlink' to="/">
                    <img src={logo2} alt="logo"/>
                    </Link>
                </div>
            </div>
            <div className='rightside'>
           
                    <div><Link className='navlink' to="/">All Items</Link></div>
                    <div><Link className='navlink' to="">Magic Wardrobe</Link></div>
                    <div><Link className='navlink' to="">ABOUT US</Link></div>
                    <div><Link className='navlink' to="">CONTACT US</Link></div>

            </div>
            <div className='rightside'>

                {!user&&<>
                    <div><Link className='navlink' to="signup">SIGN UP</Link></div>
                    <div><Link className='navlink' to="login">LOGIN</Link></div>
                </>} 

                {user&&<>
                    <div><Link className='navlink' to="/profile">Hi, {user}</Link></div>
                    <div> </div>
                    <div className='cart-menu-btn'>
                        <Link className='navlink' to="cart">
                            <Icon icon={shoppingCart} size={20}/>
                        </Link>
                        <span className='cart-indicator'>{totalProducts}</span>
                    </div>
                    <div> </div>
                    <div> </div>
                    <div className='btn btn-danger btn-md cart-btn'
                    onClick={handleLogout}>LOGOUT</div>
                </>}                     
                                
            </div>
        </div>

    )
}
