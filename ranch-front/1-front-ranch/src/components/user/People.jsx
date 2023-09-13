import React, { useEffect, useState } from 'react';
import avatar from '../../assets/img/user.png';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';

export const People = () => {

  const {auth} = useAuth();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers(1);
  }, []);

  const getUsers = async (nextPage = 1) => {

    setLoading(true);

    // Peticion para obtener usuarios
    const request = await fetch(Global.url + 'user/list/' + nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    });

    const data = await request.json();

    

    // Crear un estado para poder listarlos
    if (data.users && data.status == "success") {
      
      let newUsers = data.users;

      if(users.length >= 1){
        newUsers = [...users, ...data.users];
      }
      
      setUsers(newUsers);
      setFollowing(data.user_following);
      setLoading(false);

      // Paginacion
      if(users.length >= (data.totalUsers - data.users.length)){
        setMore(false);
      }

    }

  }

  const nextPage = () => {
    let next = page + 1;
    setPage(next);
    getUsers(next);
    console.log(following);
  }

  const follow = async(userId) => {
    // Peticion al backend para guardar el follow
    const request = await fetch(Global.url + "follow/save", {
      method: "POST",
      body: JSON.stringify({followed: userId}),
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    });
    const data = await request.json();

    // Cuando este todo correcto
    if(data.status == "success"){
      setFollowing([...following, userId]);
    }

    // Actualizar estado de following agregando el nuevo follow
  }

  const unfollow = async(userId) => {
    // Peticion al backend para borrar el follow
    const request = await fetch(Global.url + "follow/unfollow/" + userId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    });
    const data = await request.json();

    // Cuando este todo correcto
    if(data.status == "success"){
      // Actualizar estado de following filtrando los datos para eliminar el antiguo userId que acabo de dejar de seguir
      let filterFollowings = following.filter(followingUserId => userId !== followingUserId);
      setFollowing(filterFollowings);  
    }
  }

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Gente</h1>
      </header>

      <div className="content__posts">

      {loading ? "Cargando..." : ""}

        {users.map(user => {
          return (
            <article className="posts__post" key={user._id}>

              <div className="post__container">

                <div className="post__image-user">
                  <a href="#" className="post__image-link">
                    {user.image != "default.png" && <img src={Global.url + "user/avatar/" + user.image} className="post__user-image" alt="Foto de perfil" />}
                    {user.image == "default.png" && <img src={avatar} className="post__user-image" alt="Foto de perfil" />}
                  </a>
                </div>

                <div className="post__body">

                  <div className="post__user-info">
                    <a href="#" className="user-info__name">{user.name} {user.surname}</a>
                    <span className="user-info__divider"> | </span>
                    <a href="#" className="user-info__create-date">{user.created_at}</a>
                  </div>

                  <h4 className="post__content">{user.bio}</h4>

                </div>

              </div>

            {user._id !== auth._id && 
              <div className="post__buttons">

                {!following.includes(user._id) &&
                <button className="post__button post__button--green"
                onClick={() => follow(user._id)}>
                  Seguir
                </button>
                }
                {following.includes(user._id) &&
                <button className='post__button'
                onClick={() => unfollow(user._id)}>
                  Dejar de seguir
                </button>
                }

              </div>
        }

            </article>
          )
        })}



      </div>
      

      {more &&

      <div className="content__container-btn">
        <button className="content__btn-more-post" onClick={nextPage}>
          Ver mas personas
        </button>
      </div>
      }

      <br/>
    </>
  )
}
