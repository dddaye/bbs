import React, { useState } from 'react'
import {Row, Col, Form, InputGroup, Card, Button} from 'react-bootstrap';
import {app} from '../../firebaseInit'
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import { useNavigate } from 'react-router-dom';

const Join = () => {
    const navi = useNavigate();
    const [loading, setLoading] = useState(false);
    const auth=getAuth(app);
    const [form, setForm] = useState({
        email:'chunsik@kakao.com',
        pw:'12341234'
    });
    const {email, pw} = form;
    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if(email ===""){
            alert("이메일을 입력하세요.")
        }if (pw ==="") {
            alert("비밀번호를 입력하세요.")
        } else {
            //이메일 가입
            setLoading(true)
            createUserWithEmailAndPassword(auth, email, pw)
            .then(success=>{
                alert('이메일 가입 성공!');
                setLoading(false);
                navi('/login')
            })
            .catch(error=>{
                alert("※에러 발생※  " + error.message);
                setLoading(false);
            })
        }
    }

    if(loading) return <h1 className='my-5'>로딩중입니다.......</h1>
    return (
        <Row className='my-5 justify-content-center'>
            <Col md={6}>
                <Card>
                    <Card.Header>
                        <h3 className='text-center'>회원가입</h3>
                    </Card.Header>
                    <Card.Body>
                        <form onSubmit={onSubmit}>
                            <InputGroup className='mb-2'>
                            <InputGroup.Text style={{width:80}} className='justify-content-center'>
                                EMAIL</InputGroup.Text>
                            <Form.Control name="email" value={email} onChange={onChange}/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                            <InputGroup.Text style={{width:80}} className='justify-content-center'>
                                PW</InputGroup.Text>
                            <Form.Control name="pw" type='password' value={pw}  onChange={onChange}/>
                            </InputGroup>
                            <div>
                                <Button className='w-100' variant="dark" type='submit'>회원가입</Button>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default Join
