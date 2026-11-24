const Home = () => {

    return (
        <div className="flex flex-col gap-10 items-center w-full">
        
            {/*banner*/}
            <div className="bg-vinho h-[calc(100vh/2)] w-full">
                
            </div>

            {/*sobre o projeto*/}
            <div className="flex flex-row px-24 w-full items-center justify-around gap-12">
                {/*texto*/}
                <div className="flex flex-col justify-start gap-3">
                    <span className="font-serif font-semibold text-3xl text-ocre tracking-wide">
                        Sobre o projeto
                    </span>
                    <span className="font-corpo text-base text-grafite text-justify max-w-2xl">
                        Praesent aliquet rutrum enim, nec mattis dui luctus quis. Aenean congue nisl quis urna scelerisque egestas. Maecenas pellentesque turpis id ornare maximus. Nam eget nisl facilisis purus varius posuere. Suspendisse nec gravida neque. Fusce et interdum nulla, eget volutpat nisl. Morbi ipsum massa, feugiat at pellentesque non, efficitur ut leo. Curabitur non semper lectus. Vestibulum volutpat metus ut tempus placerat. Morbi in efficitur libero, hendrerit faucibus turpis. Nunc vel consectetur diam.
                    </span>
                </div>
                {/*imagem*/}
                <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvFI0PpMJi5JNSdaEAq4s2CWfSajCwYXK-HgBm3mIUPGEwkeP_fDwoB20&s=10"
                    className="w-120 h-auto shrink-0 object-contain rounded-xl shadow-[-8px_8px_12px_0px_rgba(90,30,45,0.20)]"    
                />
            </div>

            {/*o ip*/}
            <div className="bg-verde w-full px-24 py-12 flex flex-col gap-5 items-center">
                <span className="font-serif font-bold text-3xl text-white tracking-wide w-full text-justify">
                    O Imagens do povo
                </span>
                <span className="font-corpo text-brancoPapel">
                    Praesent aliquet rutrum enim, nec mattis dui luctus quis. Aenean congue nisl quis urna scelerisque egestas. Maecenas pellentesque turpis id ornare maximus. Nam eget nisl facilisis purus varius posuere. Suspendisse nec gravida neque. Fusce et interdum nulla, eget volutpat nisl. Morbi ipsum massa, feugiat at pellentesque non, efficitur ut leo. Curabitur non semper lectus. Vestibulum volutpat metus ut tempus placerat. Morbi in efficitur libero, hendrerit faucibus turpis. Nunc vel consectetur diam.
                </span>

                <div className="bg-brancoPapel-hover w-128 h-60 align-center rounded-xl">
                    
                </div>
            </div>

        </div>
    )
}

export default Home;