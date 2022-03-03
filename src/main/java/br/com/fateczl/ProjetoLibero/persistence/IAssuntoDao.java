package br.com.fateczl.ProjetoLibero.persistence;

import java.sql.SQLException;
import java.util.List;

import br.com.fateczl.ProjetoLibero.model.Assunto;

public interface IAssuntoDao {

	List<Assunto> listaAssuntos() throws SQLException, ClassNotFoundException;

}
