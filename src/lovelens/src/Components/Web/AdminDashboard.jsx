import '../Styles/AdminDashboard.css';
import NavBar from '../Routes/NavBar';
import { useState } from 'react';
import { onAuthStateChangedListener } from '../../utils/firebase.utils.js';
import axios from 'axios';
import { useEffect } from 'react';
import dateFormat from 'dateformat';
import { LOCALSTORAGEKEY } from '../../LocalStorageKeys.jsx';

export default function AdminDashboard() {
    console.log(onAuthStateChangedListener);

    const [name, setName] = useState('');
    const [data, setData] = useState([]);
    const [index, setIndex] = useState();
    const [delName, setDelName] = useState('');

    const enterRoomName = async () => {
        console.log('enterRoomName');
        var x = document.getElementsByClassName('roomNamePopup');
        var y = document.getElementsByClassName('adminDashboardContainer');
        if (x[0].style.display === 'none') {
            x[0].style.display = 'block';
            y[0].style.filter = 'blur(5px)';
        }
    };

    const token =
        'Bearer ' +
        JSON.parse(localStorage.getItem(LOCALSTORAGEKEY.login_details))
            .accessToken;
    const uid = JSON.parse(
        localStorage.getItem(LOCALSTORAGEKEY.login_details)
    ).uid;
    //console.log("token: " + token);
    //console.log("uid: " + uid);

    const createNewRoom = (e) => {
        e.preventDefault();
        console.log('createNewRoom');

        const newRoom = {
            roomName: name
        };

        axios
            .post(
                process.env.REACT_APP_URL + '/api/room/',
                JSON.stringify(newRoom),
                {
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json'
                    }
                }
            )
            .then((res) => {
                setName('');
            })
            .catch((err) => {
                console.log(err.message);
            });

        var x = document.getElementsByClassName('roomNamePopup');
        var y = document.getElementsByClassName('adminDashboardContainer');
        if (x[0].style.display === 'block') {
            x[0].style.display = 'none';
            y[0].style.filter = 'none';
        }
        window.location.reload();
    };

    const deleteConfirmation = (e, index) => {
        e.preventDefault();
        console.log('deleteConfirmation');
        setIndex(index);
        setDelName(data[index].name);
        var x = document.getElementsByClassName('confirmDeletePopup');
        var y = document.getElementsByClassName('adminDashboardContainer');
        if (x[0].style.display === 'none') {
            x[0].style.display = 'block';
            y[0].style.filter = 'blur(5px)';
        }
    };

    const deleteRoom = (e, index) => {
        e.preventDefault();
        console.log('deleteRoom');

        axios
            .delete(process.env.REACT_APP_URL + '/api/room/', {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                },
                data: {
                    room_code: data[index].room_code
                }
            })
            .then((res) => {
                console.log(res.data);
                window.location.reload();
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    const cancelCreation = async () => {
        var x = document.getElementsByClassName('roomNamePopup');
        var y = document.getElementsByClassName('adminDashboardContainer');

        if (x[0].style.display === 'block') {
            x[0].style.display = 'none';
            y[0].style.filter = 'none';
        }
    };

    const cancelDelete = async () => {
        var x = document.getElementsByClassName('confirmDeletePopup');
        var y = document.getElementsByClassName('adminDashboardContainer');

        if (x[0].style.display === 'block') {
            x[0].style.display = 'none';
            y[0].style.filter = 'none';
        }
    };

    const fetchData = async () => {
        const api = (process.env.REACT_APP_URL + '/api/room/' + uid).toString();
        axios
            .get(api, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                const { rooms } = res.data;
                setData(rooms);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    const storeRoomDetails = (e, index) => {
        //console.log("ENTER");
        var roomName = data[index].name;
        //console.log("Name " + roomName);

        localStorage.setItem(
            LOCALSTORAGEKEY.room_details,
            JSON.stringify({
                name: roomName
            })
        );
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div style={{ display: 'none' }} className="roomNamePopup">
                <button className="cancel" onClick={cancelCreation}>
                    X
                </button>
                <label>Enter Room Name:</label>
                <br></br>
                <br></br>
                <br></br>
                <input onChange={(e) => setName(e.target.value)}></input>
                <br></br>
                <br></br>
                <br></br>
                <button className="roomCreation" onClick={createNewRoom}>
                    Create Room
                </button>
            </div>
            <div style={{ display: 'none' }} className="confirmDeletePopup">
                <p>Confirm the deletion of room:</p>
                <p>{delName}?</p>
                <br></br>
                <p>
                    Note that after deletion, the room pictures can no longer be
                    retrieved.
                </p>
                <br></br>
                <div className="confirmationButtons">
                    <button
                        className="roomDelete"
                        onClick={(e) => deleteRoom(e, index)}
                    >
                        Confirm
                    </button>
                    <button className="cancelDelete" onClick={cancelDelete}>
                        Cancel
                    </button>
                </div>
            </div>
            <div style={{}} className="adminDashboardContainer">
                <NavBar></NavBar>
                <div className="contentContainerAdmin">
                    <div className="headerSection">
                        <div className="descSection">
                            <h1>Manage Collages</h1>
                            <span>
                                Create a room for image collage. Engage your
                                audience effortlessly!
                            </span>
                        </div>
                        <div className="addSection">
                            <div className="emptyContainerAdmin"></div>
                            <button onClick={enterRoomName}>&#43;</button>
                        </div>
                    </div>
                    <hr></hr>
                    <div>
                        {data.map((room, index) => (
                            <table className="mRoomTable">
                                <tr>
                                    <th>Collage Name</th>
                                    <td>{room.name}</td>
                                </tr>
                                <tr>
                                    <th>Room Code</th>
                                    <td>{room.room_code}</td>
                                </tr>
                                <tr>
                                    <th>Number of Images</th>
                                    <td>{room.num_of_pics}</td>
                                </tr>
                                <tr>
                                    <th>Creation Date</th>
                                    <td>
                                        {dateFormat(
                                            room.creation_date,
                                            'dd/mm/yyyy'
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th className="actionHeader">Action</th>
                                    <td className="actions">
                                        <button
                                            key={index}
                                            onClick={(e) =>
                                                deleteConfirmation(e, index)
                                            }
                                        >
                                            Delete
                                        </button>
                                        <a
                                            href={
                                                '/managecollage?room=' +
                                                room.room_code +
                                                '?name=' +
                                                room.name
                                            }
                                        >
                                            Manage
                                        </a>
                                        <a
                                            href={
                                                '/main?room=' + room.room_code
                                            }
                                            rel="noreferrer"
                                            target="_blank"

                                            onClick={(e) =>
                                                storeRoomDetails(e, index)
                                            }
                                        >
                                            Start
                                        </a>
                                    </td>
                                </tr>
                        </table>))}
                        <table className="roomTable">
                            <tr className="tableHeaders">
                                <th>Collage Name</th>
                                <th>Room Code</th>
                                <th>Number of Images</th>
                                <th>Creation Date</th>
                                <th className="actionHeader">Action</th>
                            </tr>
                            {data.map((room, index) => (
                                <tr>
                                    <td>{room.name}</td>
                                    <td>{room.room_code}</td>
                                    <td>{room.num_of_pics}</td>
                                    <td>
                                        {dateFormat(
                                            room.creation_date,
                                            'dd/mm/yyyy'
                                        )}
                                    </td>
                                    <td className="actions">
                                        <a
                                            href={
                                                '/main?room=' + room.room_code
                                            }
                                            rel="noreferrer"
                                            target="_blank"

                                            onClick={(e) =>
                                                storeRoomDetails(e, index)
                                            }
                                        >
                                            Start
                                        </a>
                                        <a
                                            href={
                                                '/managecollage?room=' +
                                                room.room_code +
                                                '?name=' +
                                                room.name
                                            }
                                        >
                                            Manage
                                        </a>
                                        <button
                                            key={index}
                                            onClick={(e) =>
                                                deleteConfirmation(e, index)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
