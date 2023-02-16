import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import { useSelector } from "react-redux";
import { useNavigate,Navigate, useParams} from "react-router-dom";
import { selectIsAuth } from "../../redux/slices/auth";
import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import axios from "../../axios";


export const AddPost = () => {
  const {id} = useParams()
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [loading, setLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const inputFileRef = React.useRef(null);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
    } catch (error) {
      console.log(error);
      alert("File yuklashda Xatolik Bor");
    }
  };

const isEditing = Boolean(id);


  const onClickRemoveImage = () => {
    setImageUrl('')
  };

  const onChange = React.useCallback((text) => {
    setText(text);
  }, []);

  const onSubmit = async() => {
    try {
      setLoading(true);

      const fields = {
        title,
        text,
        tags,
        imageUrl
      }

      const {data}  = isEditing 
      ? await axios.patch(`/posts/${id}`, fields)
      : await axios.post('/posts', fields);

      const _id = isEditing ? id : data._id
      
      navigate(`/posts/${_id}`);
      
    } catch (error) {
      console.log(error);
      alert('Post yaratishda xatolik ')
    }
  }

  React.useEffect(() => {
    if(id){
      axios.get(`/posts/${id}`).then(({data}) => {
        setTitle(data.title);
        setText(data.text);
        setTags(data.tags.join(','));
        setImageUrl(data.imageUrl);
      })
    }
    // eslint-disable-next-line
  }, [])

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }



  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>
          <img
            className={styles.image}
            src={`http://localhost:7777${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} type="submit"  size="large" variant="contained">
         { isEditing ? "Saqlash" : " Joylash "}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
