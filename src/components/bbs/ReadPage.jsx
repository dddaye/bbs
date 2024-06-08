import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {app} from '../../firebaseInit'
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore'
import {Row, Col, Button, Card} from 'react-bootstrap' 
import Comments from './Comments'

const ReadPage = () => {
    const navi=useNavigate();
    const loginEmail = sessionStorage.getItem('email');
    const [post, setPost] = useState('');
    const {id}=useParams();
    const db=getFirestore(app);

    const callAPI = async() => {
        const res=await getDoc(doc(db, `posts/${id}`));
        //console.log(res);
        setPost(res.data());
    }

    const {email, date, updateDate, title, contents} = post;

    useEffect(()=>{
        callAPI();
    }, [])

    const onClickDelete = async () => {
        if(!window.confirm(`ID : ${id} 게시글을 삭제하실래요?`)) return;
        //게시글 삭제
        await deleteDoc(doc(db, `/posts/${id}`));
        //window.location.href='/bbs'; 두가지 방법이 있음 이거랑 밑에 navi
        navi('/bbs'); // 이건 위에 navi 지정해줘야함
    }


    return (
        <Row className='my-5 justify-content-center'>
            <Col xs={12} md={10} lg={8}>
                <h1 className='my-5'>게시글 정보</h1>
                {loginEmail==email &&
                <div className='text-end mb-2'>
                    <Button onClick={()=>navi(`/bbs/update/${id}`)}
                        variant='outline-primary' className='me-2 px-3'>수정</Button>
                    <Button onClick={onClickDelete}
                        variant='outline-danger' className='px-3'>삭제</Button>
                </div>
                }
                <Card>
                    <Card.Body>
                        <h5 className='text-center'>{title}</h5>
                        <hr/>
                        <div style={{whiteSpace:'pre-wrap'}}>{contents}</div>
                        <hr/>
                        <div className='text-muted text-end'>
                        <span className='me-3'>{email}</span>
                        <span>작성 : {date}</span>
                        <span> / 수정 : {updateDate}</span>
                        </div>
                    </Card.Body>
                </Card>
                <Comments/>
            </Col>
        </Row>
    )
}

export default ReadPage
