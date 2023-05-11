import { useEffect } from "react";
import { increment, decrement, getCounter } from "../ReduxPractice";
import { useDispatch, useSelector } from "react-redux";

const Practice = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  // console.log(state.failResponse);

  useEffect(() => {
    dispatch(getCounter());
  }, []);

  return (
    <>
      <div>practice</div>
      <div>{state.value}</div>
      <button
        onClick={() => {
          dispatch(increment(1));
        }}
      >
        increment
      </button>
    </>
  );
};

export default Practice;
