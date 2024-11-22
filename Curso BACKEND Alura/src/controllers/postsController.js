import { getPosts, criarPost, atualizarPost } from "../models/postsModel.js";
import gerarDescricaoComGemini from "../services/gemineService.js";
import fs from "fs";

export async function listaPosts(req, res) {
    const resultado = await getPosts();
    res.status(200).json(resultado);
};

export async function postarNovoPost(req, res) {
    const novoPost = req.body;
    try {
        const postCriado = await criarPost(novoPost);
        res.status(200).json(postCriado)
    } catch(error) {
        console.error('Post não criado!! erro:', error.message)
        res.status(500).json({"erro": "falha na requisição"})
    }
};

export async function uploadImagem(req, res) {
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };
    
    try {
        const postCriado = await criarPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`
        fs.renameSync(req.file.path, imagemAtualizada)
        res.status(200).json(postCriado)
    } catch(error) {
        console.error('Post não criado!! erro:', error.message)
        res.status(500).json({"erro": "falha na requisição"})
    }
};

export async function atualizaPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`
    try {
        const imageBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imageBuffer)
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }
        const postCriado = await atualizarPost(id, post);
        res.status(200).json(postCriado)
    } catch(error) {
        console.error('Post não criado!! erro:', error.message)
        res.status(500).json({"erro": "falha na requisição"})
    };
};
