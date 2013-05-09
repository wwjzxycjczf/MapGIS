package org.act;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class SOS {

	private static String jDriver="";
	private static String dbURL="";
	private static String userName="";
	private static String userPwd="";
	public boolean readFile(){
		File file = new File("F:\\wwj\\eclipse\\workspace\\RCS\\databaseinfo.txt");
		if(file.exists()){
			if(file.isFile()){
				try{
					BufferedReader input = new BufferedReader(new FileReader(file));
                    String text;  
                         
                    while((text = input.readLine()) != null)  {
                    	if(text.indexOf("jDriver")>=0){
                    		jDriver = text.substring(text.indexOf(":")+1);
                    	}else if(text.indexOf("dbURL")>=0){
                    		dbURL = text.substring(text.indexOf(":")+1);
                    	}else if(text.indexOf("userName")>=0){
                    		userName = text.substring(text.indexOf(":")+1);
                    	}else if(text.indexOf("userPwd")>=0){
                    		userPwd = text.substring(text.indexOf(":")+1);
                    	}
                    }
                    input.close();
                    return true;
                }  
                catch(IOException ioException){  
                    System.err.println("File Error!");
                    return false;
				}
			}else{
				System.err.println("This is not a file");
				return false;
			}
		}else{
			System.err.println("File isn't exist");
			return false;
		}
		
	}
	public String GetCapablities(){
		String s="";
		return s;
	}
	public static String GetDescription(int id,int flag){
		String infostr="";
		Connection conn=null;
		Statement stmt =null;
		try{
			
			Class.forName(jDriver);
			conn = DriverManager.getConnection(dbURL, userName, userPwd);  
			stmt=conn.createStatement();// 执行SQL语句 
			ResultSet rs=null;
			String query ="";
			if(flag==0){			//雷达描述信息
				
				query = "select description from Station where radarID="+id;
				rs=stmt.executeQuery(query);  
				if(rs.next()){
					infostr = rs.getString(10);
				}
			}else if(flag==1){//返回net描述信息
			}
			
			System.out.println("查询成功");
            rs.close();  
        }catch(Exception e){  
            e.printStackTrace();  
        }  finally{ 
     	   try { 
     		      if(stmt != null) 
     		    	  stmt.close(); 
     		      if(conn!=null && !conn.isClosed()) 
     		    	  conn.close(); 
     		   }catch (SQLException e) { 
     		        e.printStackTrace(); 
     		   } 
     }
		return infostr;
	}
	
	public  static int GetState(int id,int flag){
		int state=0;
		Connection conn=null;
		Statement stmt =null;
		try{
			
			Class.forName(jDriver);
			conn = DriverManager.getConnection(dbURL, userName, userPwd);  
			stmt=conn.createStatement();// 执行SQL语句 
			ResultSet rs=null;
			String query ="";
			if(flag==0){			//雷达状态信息
				
				query = "select state from Station where radarID="+id;
				rs=stmt.executeQuery(query);  
				if(rs.next()){
//				while(rs.next()){
				state = rs.getInt(9);
				}
			}else if(flag==1){//返回ne状态信息
//				query = "select * from Client "
	//			insertStr = "insert into Client values("+information[0]+","+information[1]+")";
				
				
			}
			
			System.out.println("查询成功");
            rs.close();  
        }catch(Exception e){  
            e.printStackTrace();  
        }  finally{ 
     	   try { 
     		      if(stmt != null) 
     		    	  stmt.close(); 
     		      if(conn!=null && !conn.isClosed()) 
     		    	  conn.close(); 
     		   }catch (SQLException e) { 
     		        e.printStackTrace(); 
     		   } 
     }
		return state;
	}
	public  static boolean ConfigureSensorByID(String ctl,int id,int flag){
		Connection conn=null;
		Statement stmt =null;
		String ipaddr="";
		int port =0;
		try{
			Class.forName(jDriver);
			conn = DriverManager.getConnection(dbURL, userName, userPwd);  
			String queryStr = "";
			ResultSet rs=null;
			 stmt=conn.createStatement();// 执行SQL语句 
			if(flag==0){
				queryStr = "select ipaddr,port from Station where radarID="+id;
				System.out.println(queryStr);
				rs=stmt.executeQuery(queryStr);  
				if(rs.next()){
					ipaddr = rs.getString(1);
					port = rs.getInt(2);
				}
			}else if(flag==1){
	//			updateStr ="";
			}
			System.out.println("查询成功");
			rs.close();  
			DatagramSocket socket = new DatagramSocket();
			socket.setSoTimeout(100000);
			DatagramPacket sendPacket = new DatagramPacket(ctl.getBytes(), ctl.getBytes().length, InetAddress.getByName(ipaddr), port);
			socket.send(sendPacket);
            return true;
        }catch(Exception e){  
            e.printStackTrace();  
            return false;
        }  finally{ 
      	   try { 
      		      if(stmt != null) 
      		    	  stmt.close(); 
      		      if(conn!=null && !conn.isClosed()) 
      		    	  conn.close(); 
      		   }catch (SQLException e) { 
      		        e.printStackTrace(); 
      		   } 
      }
		
	}
public static boolean GetObservation(String info){
	Connection conn=null;
	Statement stmt =null;
	try{
		
		Class.forName(jDriver);
		conn = DriverManager.getConnection(dbURL, userName, userPwd);  
		stmt=conn.createStatement();// 执行SQL语句 
		String[] information = info.split(";");
		String insertStr= "insert into Client values("+information[0]+","+information[1]+")";
		System.out.println(insertStr);
		stmt.executeUpdate(insertStr);
		
		System.out.println("插入成功");
        return true;
    }catch(Exception e){  
        e.printStackTrace();  
        return false;
    }  finally{ 
 	   try { 
 		      if(stmt != null) 
 		    	  stmt.close(); 
 		      if(conn!=null && !conn.isClosed()) 
 		    	  conn.close(); 
 		   }catch (SQLException e) { 
 		        e.printStackTrace(); 
 		   } 
 }
	
	
}
	
//    public static void main(String[] args) {  
//    	RCSsqlserver getConn = new RCSsqlserver();
//    	if(getConn.readFile("databaseinfo.txt")){
//    		boolean flag1 = RegisterSensor("0;'2013-4-7';'军用';4;121.23;31.25;0;0;100;0;",0);
//    		System.out.println(flag1);
//    		String flag2 = GetRecord(1,0);
//    		System.out.println(flag2);
//    		String flag3 = GetRecordlist(0);
//    		System.out.println(flag3);
//    		int flag4 = GetState(0,0);
//    		System.out.println(flag4);
//    		boolean flag5 = GetObservation("'192.168.2.231';4040");
//    		System.out.println(flag5);
//    	}
//    }  
}  