import {React, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import './Error.css';
function Error() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
  }, []);

  return <div className='error-content'>Uh Oh</div>;
}

export default Error;
