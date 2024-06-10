import { useState, useEffect } from "react"
import { Social } from "../../components/social"
import { FaInstagram } from "react-icons/fa"
import { db } from '../../services/firebaseConnection'
import { 
    getDocs,
    collection,
    orderBy,
    query,
    doc,
    getDoc
} from 'firebase/firestore'

interface LinkProps{
    id: string;
    name: string;
    url: string;
    bg: string;
    color: string;
}

interface SocialLinksProps{
    facebook: string;
    instagram: string;
    youtube: string;
}

export function Home(){
    const [links, setLinks] = useState<LinkProps[]>([])
    const [socialLinks, setSocialLinks] = useState<SocialLinksProps>()
    useEffect(() => {
        function loadingLinks(){
            const linksRef = collection(db, 'links')
            const queryRef = query(linksRef, orderBy('created', 'asc'))
            getDocs(queryRef)
            .then((snapshoot) => {
                let lista = [] as LinkProps[]
                snapshoot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        name: doc.data().name,
                        url: doc.data().url,
                        bg: doc.data().bg,
                        color: doc.data().color
                    })
                })
                setLinks(lista)
            })
            .catch((error) => {
                console.log('ERRO AO CARREGAR OS LINKS' + error)
            })
        }
        loadingLinks()
    }, [])

    useEffect(() => {
        function loadSocialLinks(){
            const docRef = doc(db, 'social', 'link')
            getDoc(docRef)
            .then((snapshoot) => {
                if(snapshoot.data() !== undefined){
                    setSocialLinks({
                        facebook: snapshoot.data()?.facebook,
                        instagram: snapshoot.data()?.instagram,
                        youtube: snapshoot.data()?.youtube,
                    })
                    
                }
            })
        }
        loadSocialLinks()
    }, [])

    return(
        <div className="flex flex-col items-center justify-center w-full py-4" >
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-20" >
                Samuel 
                <span className="bg-gradient-to-r from-lime-800 to-lime-100 bg-clip-text text-transparent"> Jonas </span>
            </h1>
            <span className="text-gray-50 mt-9 mb-14" > Dev Frontend </span>
            <main className="flex flex-col w-11/12 max-w-xl text-center" >
                {links.map((link) => (
                    <section 
                        style={{backgroundColor: link.bg}}
                        className="mb-4 w-full py-1 rounded-lg select-none transition-transform 
                        hover:scale-105 hover:bg-lime-100 cursor-pointer"
                        key={link.id}>
                        <a 
                            href={link.url} 
                            target="_blank" >
                                <p className="text-base md:text-lg font-medium" style={{color: link.color}}>
                                    {link.name}
                                </p>
                        </a>
                    </section>
                ))}
                {socialLinks && Object.keys(socialLinks).length > 0 &&(
                    <footer className="flex justify-center gap-3 mt-10 mb-4" >
                        <Social url={socialLinks?.instagram}>
                            <FaInstagram size={35} color='#fff' />
                        </Social>
                </footer>
                )}
            </main>
        </div>
    )
}