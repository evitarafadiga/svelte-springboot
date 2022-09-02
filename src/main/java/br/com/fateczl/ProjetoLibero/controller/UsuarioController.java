package br.com.fateczl.ProjetoLibero.controller;

import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.fateczl.ProjetoLibero.model.Usuario;
import br.com.fateczl.ProjetoLibero.persistence.UsuarioDao;

@RestController
@RequestMapping("perfil")
public class UsuarioController {

	@Autowired
	UsuarioDao uDao;
	
	@PostMapping(path = "perfil")
	public Usuario op(@RequestBody Usuario usuarios) {
		
		Usuario u = new Usuario();
		int cod = usuarios.getId();
		
		String cmd = "";
		
		return usuarios;
	}
	
	@GetMapping
	//public Usuario getUsuario(@RequestParam(value="id", required="false") int id) {
	public Usuario getUsuario() {
		Usuario u = new Usuario();
		String erro= "";
		try {
			u = uDao.getUsuario(1);
		} catch (ClassNotFoundException | SQLException e) {
			erro = e.getMessage();
		} 
		return u;
		
	}
	
	
}
