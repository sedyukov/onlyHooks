import React, {useState, useContext, useCallback, useEffect} from 'react'
import axios from 'axios'
import {AuthContext} from '../../context/AuthContext'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import "./MainPage.scss"

const Mainpage = () => {
    const [text, setText] = useState('')
    const [todos, setTodos] = useState([])
    const {userId} = useContext(AuthContext)

    const getTodo = useCallback(async () => {
        try {
            await axios.get('/api/todo',{
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {userId}
            })
            .then((response) => setTodos(response.data))
        } 
        catch (error) {
            console.log(error)
        }
    }, [userId])

    const removeTodo = useCallback(async (id) => {
        try {
            await axios.delete(`/api/todo/delete/${id}`, {id}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(() => getTodo())
        } 
        catch (error) {
            console.log(error)
        }
    }, [getTodo])

    const completeTodo = useCallback(async (id) => {
        try {
            await axios.put(`/api/todo/complete/${id}`, {id}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                setTodos([...todos], response.data)
                getTodo()
            })
        } 
        catch (error) {
            console.log(error)
        }
    }, [getTodo, todos])

    const createTodo = useCallback(async () => {
        if (!text) return null
        try {
            await axios.post('/api/todo/add', {text,userId}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                setText('')
                setTodos([...todos], response.data)
                getTodo()
            })
        } 
        catch (error) {
            console.log(error)
        }
    }, [text, userId, todos, getTodo])

    useEffect(() => {
        getTodo()
    }, [getTodo])

    return (
        <div className="App">
            <Typography class="mg-heading" component="h1" variant="h2">
                Todos      
            </Typography> 
            <form onSubmit = {e => {
                e.preventDefault()
                createTodo()
                }  
            }>                      
                <TextField
                    variant="outlined"
                    placeholder="Add todo"
                    margin="normal"
                    onChange={event => {
                        setText(event.target.value);
                    }}
                    value = {text}
                />
            </form>
            <List>
            {
                todos.map((todo, index) => {
                    let cls = ['']
                    if (todo.completed) {
                        cls.push('completed')
                    }
                    return (
                        <ListItem key={index+1} dense button>
                            <Checkbox tabIndex={-1} onClick={() => completeTodo(todo._id)} checked={todo.completed} />
                            <ListItemText primary={todo.text}  className={cls.join(' ')}/>
                            <ListItemSecondaryAction>
                            <IconButton
                                aria-label="Delete"
                            >
                                <DeleteIcon onClick={() => removeTodo(todo._id)} />
                            </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    )
                })
            }
            </List>
        </div>
    )
}

export default Mainpage
