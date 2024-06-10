import { FormEvent, useEffect, useState } from 'react'
import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { db } from '../../services/firebaseConnection';
import { 
    setDoc,
    doc, 
    getDoc
} from 'firebase/firestore'

export function Networks(){
    const [facebook, setFacebook] = useState('')
    const [instagram, setInstagram] = useState('')
    const [youtube, setYoutube] = useState('')

    useEffect(() => {
        function loadingLinks(){
            const docRef = doc(db, 'social', 'link')
            getDoc(docRef)
            .then((snapshot) => {
                if(snapshot.data() !== undefined){
                    setFacebook(snapshot.data()?.facebook)
                    setInstagram(snapshot.data()?.instagram)
                    setYoutube(snapshot.data()?.youtube)
                }
                
            })
            .catch((error) => {
                console.log(error)
            })
        }

        loadingLinks()
        
    }, [])

    async function handleRegister(e: FormEvent){
        e.preventDefault()
        setDoc(doc(db, 'social', 'link'), {
            facebook: facebook,
            instagram: instagram,
            youtube: youtube
        })
        .then(() => {
            console.log('CADASTADROS COM SUCESSO!')
        })
        .catch((error) => {
            console.log('ERRO AO CADASTRAR' + error)
        })
    }

    return(
        <div className="flex items-center flex-col min-h-screen pb-7 px-2" >
            <Header/>
            <h1 className="text-white text-2xl font-medium mt-8 mb-4" > Minhas redes sociais </h1>
            <form className="flex flex-col w-full max-w-xl" onSubmit={handleRegister} >
                <label className="text-white font-medium mb-2 mt-3" > Link do facebook </label>
                <Input
                    type="url"
                    placeholder="Digite a url do facebook..."
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                />
                <label className="text-white font-medium mb-2 mt-3" > Link do Instagram </label>
                <Input
                    type="url"
                    placeholder="Digite a url do instagram..."
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                />
                <label className="text-white font-medium mb-2 mt-3" > Link do youtube </label>
                <Input
                    type="url"
                    placeholder="Digite a url do youtube..."
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                />
                <button 
                    type='submit'
                    className= 'h-9 bg-lime-800 border-0 text-lg font-medium text-white rounded mb-7 mt-4'
                > 
                    Salvar links
                </button>
            </form>
        </div>
    )
}