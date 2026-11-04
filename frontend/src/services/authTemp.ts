interface Admin {
    email: string, 
    senha: string
}

const AdminTeste = {
    email: 'acervooralip@gmail.com',
    senha: 'acervo123',
    nome: 'Administrador'
}

export async function loginTeste(email: string, senha: string): Promise<Admin>  {

    await new Promise(resolve => setTimeout(resolve, 800)); //so pra simular o tempo que a API levaria pra processar essa requisição

    if (email != AdminTeste.email || senha != AdminTeste.senha) {
        throw new Error("Credenciais inválidas");
    }

    localStorage.setItem("authTeste", "true"); //guarda os dados em localStorage pra simular que o admin continua logado até ele deslogar

    return {
        email : AdminTeste.email,
        senha: AdminTeste.senha
    }
};

export async function logoutTeste() {

    localStorage.removeItem("authTeste");
}