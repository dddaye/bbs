import React, { useEffect, useState } from 'react'
import {Row, Col, Card, InputGroup, Form, Button} from 'react-bootstrap'
import {app} from '../../firebaseInit'
import {getFirestore, doc, setDoc, getDoc} from 'firebase/firestore';
import ModalAddress from './ModalAddress';
import ModalPhoto from './ModalPhoto';

const Mypage = () => {
	const [loading, setLoading] = useState(false);
	const db=getFirestore(app);
	const uid=sessionStorage.getItem('uid');
	const [form, setForm] = useState({
		email:sessionStorage.getItem('email'),
		name:'김춘식',
		phone:'010-1234-1234',
		address1:'인천 동구 금곡동',
		address2:'아르누보'
	});
	const {name, phone, address1, address2} = form; //비구조할당
	const onChangeForm = (e) => {
		setForm({...form, [e.target.name]:e.target.value});
	}
	const onSubmit = async (e) => {
		e.preventDefault();
		if(name === ""){
			alert("이름을 입력하세요!");
			return;
		}
		// 정보를 저장
		if(!window.confirm("변경된 내용을 저장하실래요?")) return;
		console.log(form);
		setLoading(true);
		await setDoc(doc(db, `users/${uid}`),form);
		setLoading(false);
	}

	const callAPI = async () => {
		setLoading(true);
		const res=await getDoc(doc(db, `users/${uid}`));
		if(res.data()){
			setForm(res.data())
		}
		setLoading(false);
	}

	useEffect(()=>{
		callAPI();
	},[]);

	if(loading) return <h1 className='text-center my-5'>로딩중...</h1>
	return (
		<Row className='justify-content-center my-5'>
			<Col xs={12} md={10} lg={8}>
				<Card>
					<Card.Header>
						<h3 className='my-1 text-center'>마이페이지</h3>
					</Card.Header>
					<Card.Body>
						<div className='text-center'>
							<ModalPhoto setLoading={setLoading} form={form} setForm={setForm}/>
						</div>
						<form onSubmit={onSubmit}>
							<InputGroup className='mb-2'>
								<InputGroup.Text>Name</InputGroup.Text>
								<Form.Control name="name" value={name} onChange={onChangeForm}/>
							</InputGroup>
							<InputGroup className='mb-2'>
								<InputGroup.Text>Phone</InputGroup.Text>
								<Form.Control name="phone" value={phone} onChange={onChangeForm}/>
							</InputGroup>
							<InputGroup className='mb-1'>
								<InputGroup.Text>Address</InputGroup.Text>
								<Form.Control name="address1" value={address1} onChange={onChangeForm}/>
								<ModalAddress form={form} setForm={setForm}/>
							</InputGroup>
							<Form.Control name="address2" value={address2} placeholder='상세주소' onChange={onChangeForm}/>
							<div className='text-center mt-3'>
								<Button variant="outline-primary" className='px-3' type='submit'>저장</Button>
								<Button variant="outline-danger" className='ms-2 px-3'>취소</Button>
							</div>
						</form>
					</Card.Body>
				</Card>
			</Col>
		</Row>
	)
}

export default Mypage
