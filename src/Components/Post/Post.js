import * as React from 'react';
import { useEffect, useState } from 'react';
import './Post.css'
import Fuse from 'fuse.js'
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button1 from '@mui/material/Button';
import Typography1 from '@mui/material/Typography';

function SimpleDialog(props) {
  const { onClose, selectedValue, open } = props;
  const [comment, setComment] = useState([]);

  const handleClose = () => {
    onClose(selectedValue);
  };
  
  useEffect(() => {
    // Fetch comments for the selected post
    axios
      .get(`https://jsonplaceholder.typicode.com/posts/${props.selectedValue}/comments`)
      .then((res) => {
        console.log(res.data);
        setComment(res.data);
      });
  }, [props.selectedValue]); // Include props.selectedValue in the dependency array to re-fetch comments when it changes

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Comments</DialogTitle>
     
      <List sx={{ pt: 0 }}>
        {comment.map((i) => (
          <ListItem disableGutters key={i.id}>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={i.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.number.isRequired, // Change the prop type to number
};

export default function SimpleDialogDemo() {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(null); // Initialize selectedValue as null
  const [info, setInfo] = useState([]);
  const [post, setPost] = useState([]);
  const [searchKey,setSearchKey]=useState("");
  const options = {
    keys: ['title', 'body'], // Fields to search in
    threshold: 0.4, // Adjust the fuzziness threshold as needed
  };
  const handleInputChange = (e) => {
    console.log(info.length)
    const query = e.target.value;
    localStorage.setItem("query",query)
    setSearchKey(query)
    const fuse = new Fuse(post, options);
    const results = fuse.search(query);
    for(var i=0;i<results.length;i++){
      results[i]=results[i].item
    }
    localStorage.setItem("results",JSON.stringify(results))
    if (query === "") {
      setInfo(post)
    }else{
      setInfo(results)
    }
    
    console.log(info) 

    console.log(results)
    // Handle and display the search results
  };

  const handleClickOpen = (i) => {
    setOpen(true);
    setSelectedValue(i.id); // Set the selectedValue to the post ID
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(null); // Reset selectedValue when the dialog is closed
  };

  const deletepost= (id) => {
    axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`)
    .then((res) => {
      setInfo((prevState) => prevState.filter((post) => post.id !== id));
    })
  }

  useEffect(() => {
    const a=localStorage.getItem("query")
    console.log(a)
    if (a && a!=""){
      setSearchKey(localStorage.getItem("query"))
      setInfo(JSON.parse(localStorage.getItem("results")))
    }
    else{
      axios.get("https://jsonplaceholder.typicode.com/posts")
      .then((res) => {
        console.log(res.data);
        setInfo(res.data);
        setPost(res.data)
      });
    }
    
  },[]);

  return (
    <div>
      <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <div className='search-button'>
        <TextField id="outlined-basic" label="Search" name="query" value={searchKey} variant="outlined" onChange={handleInputChange}/>
        <SearchIcon className='button1'/>
      </div>
      
    </Box>
      {info.map((i) => (
        <Box margin="30px" width="450px" key={i.id}>
          <Card>
          
            <CardContent>
              <Typography1 gutterBottom variant="h5" component="div">
                {i.title}
              </Typography1>
              <Typography1 variant="body2" component="div">
                {i.body}
              </Typography1>
            </CardContent>
            <CardActions className='card-button'>
              <Button1 size="small" onClick={() => handleClickOpen(i)}>Read Comments</Button1>
              <DeleteIcon className='delete-icon' onClick={()=>{deletepost(i.id)}}/>
            </CardActions>
            
          </Card>
        </Box>
      ))}
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
