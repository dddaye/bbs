import axios from 'axios';
import React, { useState, useEffect } from 'react'
import {Table, Row, Col, InputGroup, Form, Button} from 'react-bootstrap'
import {app} from '../../firebaseInit'
import {getDatabase, ref, set, get} from 'firebase/database';
import { useNavigate } from 'react-router-dom';

const Locals = () => {
    const navi = useNavigate();
    const db = getDatabase(app);
    const uid = sessionStorage.getItem('uid');
    const [loading, setLoading] = useState(false);
    const [query, SetQuery] = useState('인하대학교');
    const [page, SetPage] = useState(1);
    const [locals, setLocals] = useState([]);
    const [isend, setIsend] = useState(false);
    
    const callAPI = async() => {
        setLoading(true);
        const url=`https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}&size=10&page=${page}`;
        const config={
        headers:{"Authorization":"KakaoAK f23e7e2e27ac02c8ef22fe940b70cfd0"}
        };
        const res=await axios.get(url, config);
        setLocals(res.data.documents);
        setIsend(res.data.meta.is_end);
        //console.log(res.data.documents);
        setLoading(false);
    }

    const onClickFavorite = async(local) => {
        if(!uid){
            sessionStorage.setItem('target', '/locals')
            navi('/login');
            return;
        }
        if(window.confirm("즐겨찾기에 추가하실래요?")){
            console.log(local);
            setLoading(true);
            await get(ref(db, `favorite/${uid}/${local.id}`)).then(async snapshot=>{
                if(snapshot.exists()){
                    alert("이미 즐겨찾기에 등록되었습니다.")
                }else{
                    await set(ref(db, `favorite/${uid}/${local.id}`), local);
                    alert("즐겨찾기에 등록되었습니다.")
                }
            });
            setLoading(false);
        }
    }

    useEffect(()=>{
        callAPI();
    }, [page]);

    const onSubmit = (e) => {
        e.preventDefault();
        if(query===""){
            alert("검색어를 입력하세요!");
        }else{
            SetPage(1);
            callAPI();
        }
    }

    if(loading) return <h1 className='my-5'>로딩중 입니다.....</h1>

    return (
        <div>
            <h1 className='my-5'>지역검색</h1>
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
            <Table striped bordered hover>
                <thead>
                    <tr className='text-center'>
                        <td>ID</td>
                        <td>장소명</td>
                        <td>주소</td>
                        <td>전화번호</td>
                        <td>즐겨찾기</td>
                    </tr>
                </thead>
                <tbody>
                    {locals.map(local=>
                        <tr key={local.id} className='text-center'>
                            <td>{local.id}</td>
                            <td>{local.place_name}</td>
                            <td>{local.address_name}</td>
                            <td>{local.phone}</td>
                            <td><Button onClick={()=>onClickFavorite(local)} variant="outline-dark">즐겨찾기</Button></td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <div className='text-center my-3'>
            <Button onClick={()=>SetPage(page-1)} disabled={page===1} variant="outline-dark">이전</Button>
            <span className='mx-2'>{page}</span>
            <Button onClick={()=>SetPage(page+1)} disabled={isend} variant="outline-dark">다음</Button>
            </div>
        </div>
        
    )
}

export default Locals
