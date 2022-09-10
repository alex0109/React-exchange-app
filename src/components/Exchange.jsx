import React, { useState, useEffect } from 'react'
import { Alert, Container, Grid, IconButton, MenuItem, Select, Snackbar, TextField } from '@mui/material'
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import { useFormik } from "formik"
import * as Yup from "yup"
import axios from 'axios'

const Exchange = () => {
    //Настройка запроса
    const API_KEY = 'jwiVUPQ7HJj76U6ZPa1cDVdKVCaXr5ga'

    //Стейты для выбора валюты
    const [currencyFrom, setCurrencyFrom] = useState('')
    const [currencyTo, setCurrencyTo] = useState('')

    //Функции для изменения валюты
    const currencyFromHandleChange = (event) => {
        setCurrencyFrom(event.target.value);
      };
    const currencyToHandleChange = (event) => {
        setCurrencyTo(event.target.value);
    };

    //Функция для переключения валюты
    const switchCurrency = () => {
        setCurrencyFrom(currencyTo)
        formik.setFieldValue('fromValue', formik.values.toMyValue)
        setCurrencyTo(currencyFrom)
        formik.setFieldValue('toMyValue', formik.values.fromValue)
    }

    //Использование formik и yup для упрощения работы с данными и их валидации
    const formik = useFormik({
        initialValues: {
            fromValue: 0,
            toMyValue: 0
        },
        validationSchema: Yup.object({
            fromValue: Yup.number().required("Required").positive("Must be positive")
        }),
        onSubmit: () => {}
    })

    useEffect( () => {
        axios.get(`https://api.apilayer.com/exchangerates_data/convert?to=${currencyTo}&from=${currencyFrom}&amount=${formik.values.fromValue}`, {headers: {'apikey': API_KEY}})
        .then(res => formik.setFieldValue('toMyValue', res.data.result))
    }, [currencyFrom, currencyTo, formik])
    
    return (
        <Container sx={{mt: 5}}>
            <form onSubmit={formik.handleSubmit}>
                <Grid container 
                    justifyContent="center" 
                    alignItems="center" 
                    spacing={1}>
                    <Grid item>
                        <TextField 
                            id='formValue'
                            type='number'
                            name='fromValue'
                            placeholder='From currency'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.fromValue} 
                        />
                        <Select
                            name='currenciesFrom'
                            onChange={currencyFromHandleChange}
                            value={currencyFrom}
                        >
                            <MenuItem value={'USD'}>USD</MenuItem>
                            <MenuItem value={'EUR'}>EUR</MenuItem>
                            <MenuItem value={'UAH'}>UAH</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={switchCurrency}>
                            <SyncAltIcon/>
                        </IconButton>
                    </Grid> 
                    <Grid item>
                        <TextField 
                            color='success'
                            id='toMyValue'
                            type='number'
                            name='toMyValue'
                            value={formik.values.toMyValue}
                            InputProps={{
                                readOnly: true,
                              }}
                        />
                        <Select
                            name='currenciesTo'
                            onChange={currencyToHandleChange}
                            value={currencyTo}
                        >
                            <MenuItem value={'USD'}>USD</MenuItem>
                            <MenuItem value={'EUR'}>EUR</MenuItem>
                            <MenuItem value={'UAH'}>UAH</MenuItem>
                        </Select>
                    </Grid>
                </Grid>
                {!currencyFrom || !currencyTo ? <Snackbar open='true'><Alert severity="error">Must be currency type</Alert></Snackbar> : null}
                {formik.touched.fromValue && formik.errors.fromValue ? <Snackbar open='true'><Alert severity="error">{formik.errors.fromValue}</Alert></Snackbar> : null}
                {formik.touched.toMyValue && formik.errors.toMyValue ? <Snackbar open='true'><Alert severity="error">{formik.errors.toMyValue}</Alert></Snackbar> : null}
            </form>
        </Container>
    )
}

export default Exchange