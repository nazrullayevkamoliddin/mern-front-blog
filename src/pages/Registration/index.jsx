import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";
import { Navigate } from "react-router-dom";

import styles from "./Login.module.scss";

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName:"Kamoliddin Nazrullayev",
      email: "kamolxoja.n@gmail.com",
      password: "654321",
    },
    mode: "onChange",
  });

  const onSubmit = async(values) => {
    const data = await  dispatch(fetchRegister(values));

    if(!data.payload){
      return alert('Registratsiya qilib bolmadi');
    }
      
    if('token' in data.payload){
      window.localStorage.setItem('token', data.payload.token);
    }
  };

  if(isAuth){   
    return <Navigate to='/' />
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Registartion
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        error={Boolean(errors.fullName?.message)}
        type="text"
        helperText={errors.fullName?.message}
        {...register("fullName", { required: "FullNameni kiriting" })}
        className={styles.field}
        label="Full Name"
        fullWidth
      />
      <TextField
        error={Boolean(errors.email?.message)}
        type="email"
        helperText={errors.email?.message}
        {...register("email", { required: "emailni kiriting" })}
        className={styles.field}
        label="email"
        fullWidth
      />
      <TextField
        error={Boolean(errors.password?.message)}
        type="password"
        helperText={errors.password?.message}
        {...register("password", { required: "passwordni kiriting" })}
        className={styles.field}
        label="Пароль"
        fullWidth
      />
      <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
        Зарегистрироваться
      </Button>
      </form>
    </Paper>
  );
};
