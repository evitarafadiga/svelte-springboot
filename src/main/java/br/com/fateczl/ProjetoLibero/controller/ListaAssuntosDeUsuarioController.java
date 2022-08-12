package br.com.fateczl.ProjetoLibero.controller;

import java.sql.SQLException;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import antlr.collections.List;
import br.com.fateczl.ProjetoLibero.persistence.AssuntoDao;

@RestController
@RequestMapping("index")
public class ListaAssuntosDeUsuarioController {

    @Autowired
    AssuntoDao aDao;

    @GetMapping
    public List<Assunto> getListAssuntoDeUsuario() {
        List<Assunto> listaAssuntosDeUsuario = new ArrayList<Assunto>();
        String erro = "";
        try {
            listaAssuntosDeUsuario = aDao.listaAssuntosDeUsuario();
        } catch (ClassNotFoundException | SQLException e) {
			erro = e.getMessage();
		}
        return listaAssuntosDeUsuario;
    }
    

}
