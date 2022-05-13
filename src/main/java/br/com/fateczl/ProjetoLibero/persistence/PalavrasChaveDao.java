package br.com.fateczl.ProjetoLibero.persistence;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Types;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.fateczl.ProjetoLibero.model.PalavraChave;

@Component 
public class PalavrasChaveDao implements IPalavrasChaveDao {
	
	@Autowired
	GenericDao gDao;
	
	private Connection c;
	
	@Override
	public String insertPalavraChave(PalavraChave p) throws SQLException {
		String saida = insUpdDel(p,"I");
		return saida;
	}

	@Override
	public String updatePalavraChave(PalavraChave p) throws SQLException {
		String saida = insUpdDel(p,"U");
		return saida;
	}

	@Override
	public String deletePalavraChave(PalavraChave p) throws SQLException {
		String saida = insUpdDel(p,"D");
		return saida;
	}
	
	public String insUpdDel(PalavraChave p, String cod) throws SQLException {
		String sql = "{CALL sp_iud_palavraschave (?,?,?,?)}";
		CallableStatement cs = c.prepareCall(sql);
		cs.setString(1, cod);
		cs.setInt(2, p.getIndice());
		cs.setString(3, p.getTexto());
		cs.registerOutParameter(4, Types.VARCHAR);
		
		cs.execute();
		String saida = cs.getString(4);
		cs.close();
		c.close();
		return saida;
	}

}
