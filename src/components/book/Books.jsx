import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {Row, Col, Card, InputGroup, Form, Button} from 'react-bootstrap'
import { BsBagHeart } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import {app} from '../../firebaseInit'
import {getDatabase, ref, set, get} from 'firebase/database';

const Books = () => {
    const db = getDatabase(app);
    const navi = useNavigate();
    const uid=sessionStorage.getItem('uid');
    const [page, SetPage] = useState(1)
    const [query, SetQuery] = useState('자바');
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [isend, setIsend] = useState(false);
    
    const callAPI = async() => {
        setLoading(true);
        const url=`https://dapi.kakao.com/v3/search/book?target=title&query=${query}&size=12&page=${page}`;
        const config={
        headers:{"Authorization":"KakaoAK f23e7e2e27ac02c8ef22fe940b70cfd0"}
        };
        const res=await axios.get(url, config);
        console.log(res.data);
        setBooks(res.data.documents);
        setIsend(res.data.meta.is_end);
        setLoading(false);
    }

    useEffect(()=>{
        callAPI();
    }, [page]);

    const onSubmit = (e) => {
        e.preventDefault();
        SetPage(1);
        callAPI();
    }

    const onClickCart = (book) => {
        if(uid){
            //장바구니에 도서 넣기
            if(window.confirm(`"${book.title}"\n도서를 장바구니에 추가할까요?`)){
                //장바구니 중복 체크
                get(ref(db, `cart/${uid}/${book.isbn}`)).then(snapshot=>{
                    if(snapshot.exists()){
                        alert("이미 장바구니에 있습니다.")
                    }else{
                        set(ref(db,`cart/${uid}/${book.isbn}`), {...book});
                    alert("장바구니에 추가되었습니다.");
                    }
                });
            }
        }else{
            sessionStorage.setItem('target', '/books');
            navi('/login')
        }
    }

    if(loading) return <h1 className='my-5'>로딩중 입니다.....</h1>
    return (
        <div>
        <h1 className='my-5'>도서검색</h1>
        <Row className='mb-2'>
            <Col xs={8} md={6} lg={4}>
                <form onSubmit={onSubmit}>
                    <InputGroup>
                    <Form.Control onChange={(e)=>SetQuery(e.target.value)}
                        placeholder='검색어' value={query}/>
                    <Button type='submit' variant="outline-dark">검색</Button>
                    </InputGroup>
                </form>
            </Col>
        </Row>
        <Row>
            {books.map(book=>
                <Col key={book.isbn} xs={6} md={3} lg={2} className='mb-2'>
                    <Card>
                        <Card.Body className='justify-content-center d-flex'>
                            <img width="90%"
                            src={book.thumbnail || 'http://via.placeholder.com/120x170'}/>
                        </Card.Body>
                        <Card.Footer>
                            <div className='ellipsis'>{book.title}</div>
                            <BsBagHeart onClick={()=>onClickCart(book)}
                                style={{cursor:'pointer', fontSize:'20px', color:'orange'}}/>
                        </Card.Footer>
                    </Card>
                </Col>)}
        </Row>
        <div className='text-center my-3'>
            <Button onClick={()=>SetPage(page-1)} disabled={page===1} variant="outline-dark">이전</Button>
            <span className='mx-2'>{page}</span>
            <Button onClick={()=>SetPage(page+1)} disabled={isend} variant="outline-dark">다음</Button>
        </div>
        </div>
    )
    }

    export default Books
