import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { recoverPassword, reset } from "../../features/auth/authSlice";
import { toast } from "react-toastify";

export const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const initialTime = 60;
  const [timer, setTimer] = useState(initialTime);
  const intervalRef = useRef(null);

  const dispatch = useDispatch();
  const { isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
      return
    } else if (isSuccess){
      toast.success('Email sent');
    }
    dispatch(reset())
  }, [isError, message, isSuccess, dispatch]);


  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime === 0) {
          resetTimer()
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTimer(initialTime); 
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(recoverPassword({email: email}));
    startTimer();
  };

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <div style={{ padding: '10rem'}}>
      <form onSubmit={handleSubmit}>
        <div><p>Check your inbox/spam/junk for email </p></div>
        <label htmlFor="email">Email</label>
        <input
        required
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleChange}
        />
        <div>
            
           <p>Did not recieve an email? resend in:</p>
          <>{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</>
       
        </div>
        <div>
          <button type="submit">Send</button>
        </div>
      </form>
    </div>
  );
};
