import { FormEvent, useState, useEffect } from 'react'
import { Header } from '../../components/Header'
import { Input }  from '../../components/Input'
import { FiTrash } from 'react-icons/fi'
import { IoLinkSharp } from "react-icons/io5";

import { db } from '../../services/firebaseConnection'
import {
    addDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    doc,
    deleteDoc
} from 'firebase/firestore'

interface LinkProps{
    id: string;
    name: string;
    url: string;
    bg: string;
    color: string;
}

export function Admin(){
    const [nameInput, setNameInput] = useState('')
    const [urlInput, setUrlInput] =useState('')
    const [backgroundColorInput, setBackgroundColorInput] = useState('#f1f1f1')
    const [textColorInput, setTextColorInput] = useState('#000')
    const [links, setLinks] = useState<LinkProps[]>([])

    useEffect(() => {
        const linksRef = collection(db, 'links')
        const queryRef = query(linksRef, orderBy('created', 'asc'))
        const unsub = onSnapshot(queryRef, (snapshot) => {
            let lista = [] as LinkProps[];
            snapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    name: doc.data().name,
                    url: doc.data().url,
                    bg: doc.data().bg,
                    color: doc.data().color,
                })
            })
            setLinks(lista)
        })
        return () => {
            unsub()
        }
    }, [])

    function handleRegister(e: FormEvent){
        e.preventDefault()
        if(nameInput === '' || urlInput === ''){
            alert('Preencha todos os campos!')
            return;
        }
        addDoc(collection(db, 'links', ), {
            name: nameInput,
            url: urlInput,
            bg: backgroundColorInput,
            color: textColorInput,
            created: new Date(),
        })
        .then(() => {
            console.log('USUÁRIO CADASTRADO COM SUCESSO!')
            setNameInput('')
            setUrlInput('')
        })
        .catch((error) => {
            console.log('ERRO AO FAZER O CADASTRO!' + error)
        })
    }

    async function handleDeleteLink(id: string){
        const docRef = doc(db, 'links', id)
        await deleteDoc(docRef)
    }

    return(
        <div className={'flex items-center flex-col min-h-screen pb-7 px-2'} >
            <Header/>
            <form className='flex flex-col w-full max-w-xl mt-10 mb-5' onSubmit={handleRegister} >
                <label className='text-white font-medium mb-2 mt-5' > Nome do link </label>
                <Input
                    placeholder='Digite o nome do link...'
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                />
                <label className='text-white font-medium mb-2 mt-5' > URL do link </label>
                <Input
                    className='mb-60'
                    type='url'
                    placeholder='Digite a url...'
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                />
                <section className='flex my-10 gap-10' >
                    <div className='flex gap-2'>
                        <label className='text-white font-medium mb-2' > Fundo do link </label>  
                        <input 
                            type="color" 
                            value={backgroundColorInput}
                            onChange={e => setBackgroundColorInput(e.target.value)}
                        />
                    </div>
                    <div className='flex gap-2'>
                        <label className='text-white font-medium mb-2' > Cor do link </label>  
                        <input 
                            type="color" 
                            value={textColorInput}
                            onChange={e => setTextColorInput(e.target.value)}
                        />
                    </div>
                </section>
                {nameInput !== '' && (
                    <div className='flex items-center justify-center flex-col mb-10 p-1 border border-gray-100/25 rounded-md' >
                        <label className='text-white font-medium mb-2' > Veja como está ficando... </label>  
                        <article
                            className='w-11/12 max-w-lg flex flex-col items-center justify-between bg-zinc-900 rounded px-1 py-3'
                            style={{ marginTop: 8, marginBottom: 8, backgroundColor: backgroundColorInput}}>
                            <p className='font-medium' style={{color: textColorInput }} > {nameInput} </p>
                        </article>
                    </div>
                )}
                <button
                    className="flex items-center justify-center gap-2 h-9 bg-lime-800 border-0 text-lg font-medium text-white rounded mb-7" 
                    type='submit'>
                    Cadastrar
                    <IoLinkSharp size={20} />
                </button>
            </form>
            <h2 className='text-white font-bold mb-4 text-2xl' >
                Meus links:
            </h2>
            {links.map((item) => (
                <article 
                    className='flex mb-5 items-center justify-between w-11/12 max-w-xl rounded px-2 py-3 select-none '
                    style={{ backgroundColor: item.bg, color: item.color}}
                    key={item.id}
                >
                <p> {item.name} </p>
                <div>
                    <button 
                        className='border border-dashed py-1 px-2 rounded bg-neutral-950' 
                        onClick={() => handleDeleteLink(item.id)}
                    >
                        <FiTrash size={18} color='#fff' />
                    </button>
                </div>
            </article>
            ))}
        </div>
    )
}