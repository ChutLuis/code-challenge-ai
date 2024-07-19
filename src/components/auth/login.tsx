import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserToken } from '../../redux/userReducer';
import Logo from '../../assets/new-logo.svg'
import RFQService from '../../utils/apiService';
const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e:any) => {
    e.preventDefault();
    // Replace with real authentication logic
    if (username && password) {
      RFQService.logIn(username,password)
      .then((response) => {
        const data = response.data as {userId:string,jwt:string}
        if(response.data){
          dispatch(setUserToken({token:data.jwt}))
        }
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
      });
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen">
      <div className="w-1/2 h-auto hidden lg:block">
        <img 
          src={Logo}
          alt="Placeholder Image" 
          className="object-cover w-full h-full" 
        />
      </div>
      <div className="lg:p-36 md:p-52 sm:p-20 p-8 w-full lg:w-1/2">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-600">Email</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" 
              autoComplete="off" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" 
              autoComplete="off" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">Login</button>
        </form>
        <div className="mt-6 text-blue-500 text-center">
          <a onClick={()=>navigate('/signup')} className="hover:underline cursor-pointer">Sign up Here</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
