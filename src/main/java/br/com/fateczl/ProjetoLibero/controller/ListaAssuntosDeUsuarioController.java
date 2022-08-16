package br.com.fateczl.ProjetoLibero.controller;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.fateczl.ProjetoLibero.model.Assunto;
import br.com.fateczl.ProjetoLibero.persistence.AssuntoDao;

@RestController
@RequestMapping("assuntos")
public class ListaAssuntosDeUsuarioController {

    @Autowired
    AssuntoDao aDao;

    @GetMapping
    public List<Assunto> getListAssuntoDeUsuario() {
        int id = 1;

        List<Assunto> listaAssuntosDeUsuario = new ArrayList<Assunto>();
        String erro = "";
        
        try {
            listaAssuntosDeUsuario = aDao.listaAssuntosDeUsuario(id);
        } catch (ClassNotFoundException | SQLException e) {
			erro = e.getMessage();
		}
        return listaAssuntosDeUsuario;
    }
    

}
