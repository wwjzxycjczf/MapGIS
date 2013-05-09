package org.act;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class RCSsqlserver {

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
	public static boolean RegisterSensor(String info,int flag){
		Connection conn=null;
		Statement stmt =null;
		try{
			
			Class.forName(jDriver);
			conn = DriverManager.getConnection(dbURL, userName, userPwd);  
//			String query ="select MAX(radarID) from Station";
			stmt =conn.createStatement();// 执行SQL语句 
//			ResultSet rs=stmt.executeQuery(query);
//			int maxId =1;
//			if(rs.next()){
//				 maxId = rs.getInt(1)+1;
//			}
			String[] information = info.split(";");
			String insertStr="";
			if(flag==0){			//雷达信息
				insertStr = "insert into Station values("+information[0]+","+information[1]+","+information[2]+","+information[3]+","+information[4]+","
						+information[5]+","+information[6]+","+information[7]+","+information[8]+","+information[9]+")";
			}else if(flag==1){
	//			insertStr = "insert into Client values("+information[0]+","+information[1]+")";
				
			}
			System.out.println(insertStr);
			stmt.executeUpdate(insertStr);
			System.out.println("插入成功");
        //    stmt.close();  
      //      conn.close();  
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
	public static String GetRecord(int id,int flag){
		String information="";
		Connection conn=null;
		Statement stmt =null;
		try{
			
			Class.forName(jDriver);
			conn = DriverManager.getConnection(dbURL, userName, userPwd);  
			stmt=conn.createStatement();// 执行SQL语句 
			ResultSet rs=null;
			String query ="";
			if(flag==0){			//雷达信息
				
				query = "select * from Station where radarID="+id;
				System.out.println(query);
				rs=stmt.executeQuery(query);  
				if(rs.next()){
					information = rs.getInt(1)+";"+rs.getInt(2)+";"+rs.getString(3)+";"+rs.getString(4)+";"+rs.getInt(5)+";"
						+rs.getFloat(6)+";"+rs.getFloat(7)+";"+rs.getInt(8)+";"+rs.getInt(9);
				}
			}else if(flag==1){//返回net信息
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
		return information;
	}
	
	public static String GetRecordlist(int flag){
		Connection conn=null;
		Statement stmt =null;
		String recordlist="{\"type\":\"stationlist\", \"data\":[";
		try{
			
			Class.forName(jDriver);
			conn = DriverManager.getConnection(dbURL, userName, userPwd);  
			stmt=conn.createStatement();// 执行SQL语句 
			ResultSet rs=null;
			String query ="";
			if(flag==0){			//雷达信息列表
				query = "select * from Station";
				rs=stmt.executeQuery(query);  
				while(rs.next()){
					recordlist +="{\"RadaID\":\""+ rs.getInt(1)+"\",\"radar_type\":\""+rs.getInt(2)+"\",\"time\":\""+rs.getString(3)+"\",\"admin\":\""+rs.getString(4)+"\",\"personnel\":\""+rs.getInt(5)+"\",\"lon\":\""
						+rs.getFloat(6)+"\",\"lat\":\""+rs.getFloat(7)+"\",\"is_on\":\""+rs.getInt(8)+"\",\"azi\":\""+rs.getInt(9)+"\",\"height\":\""+rs.getInt(10)+"\",\"state\":\""+rs.getInt(11)+"\"},";
				}
				recordlist = recordlist.substring(0, recordlist.length()-1);
				recordlist+="]}";
			}else if(flag==1){//返回net信息列表
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
		return recordlist;
	}
//	public static String GetDescription(int id,int flag){
//		String infostr="";
//		Connection conn=null;
//		Statement stmt =null;
//		try{
//			
//			Class.forName(jDriver);
//			conn = DriverManager.getConnection(dbURL, userName, userPwd);  
//			stmt=conn.createStatement();// 执行SQL语句 
//			ResultSet rs=null;
//			String query ="";
//			if(flag==0){			//雷达描述信息
//				
//				query = "select description from Station where radarID="+id;
//				rs=stmt.executeQuery(query);  
//				if(rs.next()){
//					infostr = rs.getString(10);
//				}
//			}else if(flag==1){//返回net描述信息
//			}
//			
//			System.out.println("查询成功");
//            rs.close();  
//        }catch(Exception e){  
//            e.printStackTrace();  
//        }  finally{ 
//     	   try { 
//     		      if(stmt != null) 
//     		    	  stmt.close(); 
//     		      if(conn!=null && !conn.isClosed()) 
//     		    	  conn.close(); 
//     		   }catch (SQLException e) { 
//     		        e.printStackTrace(); 
//     		   } 
//     }
//		return infostr;
//	}
//	public  static int GetState(int id,int flag){
//		int state=0;
//		Connection conn=null;
//		Statement stmt =null;
//		try{
//			
//			Class.forName(jDriver);
//			conn = DriverManager.getConnection(dbURL, userName, userPwd);  
//			stmt=conn.createStatement();// 执行SQL语句 
//			ResultSet rs=null;
//			String query ="";
//			if(flag==0){			//雷达状态信息
//				
//				query = "select state from Station where radarID="+id;
//				rs=stmt.executeQuery(query);  
//				if(rs.next()){
////				while(rs.next()){
//				state = rs.getInt(9);
//				}
//			}else if(flag==1){//返回ne状态信息
////				query = "select * from Client "
//	//			insertStr = "insert into Client values("+information[0]+","+information[1]+")";
//				
//				
//			}
//			
//			System.out.println("查询成功");
//            rs.close();  
//        }catch(Exception e){  
//            e.printStackTrace();  
//        }  finally{ 
//     	   try { 
//     		      if(stmt != null) 
//     		    	  stmt.close(); 
//     		      if(conn!=null && !conn.isClosed()) 
//     		    	  conn.close(); 
//     		   }catch (SQLException e) { 
//     		        e.printStackTrace(); 
//     		   } 
//     }
//		return state;
//	}
//	public  static boolean ConfigureSensorByID(String ctl,int id,int flag){
//		Connection conn=null;
//		Statement stmt =null;
//		try{
//			Class.forName(jDriver);
//			conn = DriverManager.getConnection(dbURL, userName, userPwd);  
//			String updateStr = "";
//			if(flag==0){
//				updateStr = "";
//			}else if(flag==1){
//				updateStr ="";
//			}
//			 stmt=conn.createStatement();// 执行SQL语句 
//			stmt.executeUpdate(updateStr);
//			System.out.println("修改成功");
//            return true;
//        }catch(Exception e){  
//            e.printStackTrace();  
//            return false;
//        }  finally{ 
//      	   try { 
//      		      if(stmt != null) 
//      		    	  stmt.close(); 
//      		      if(conn!=null && !conn.isClosed()) 
//      		    	  conn.close(); 
//      		   }catch (SQLException e) { 
//      		        e.printStackTrace(); 
//      		   } 
//      }
//		
//	}
//public static boolean GetObservation(String info){
//	Connection conn=null;
//	Statement stmt =null;
//	try{
//		
//		Class.forName(jDriver);
//		conn = DriverManager.getConnection(dbURL, userName, userPwd);  
//		stmt=conn.createStatement();// 执行SQL语句 
//		String[] information = info.split(";");
//		String insertStr= "insert into Client values("+information[0]+","+information[1]+")";
//		System.out.println(insertStr);
//		stmt.executeUpdate(insertStr);
//		
//		System.out.println("插入成功");
//        return true;
//    }catch(Exception e){  
//        e.printStackTrace();  
//        return false;
//    }  finally{ 
// 	   try { 
// 		      if(stmt != null) 
// 		    	  stmt.close(); 
// 		      if(conn!=null && !conn.isClosed()) 
// 		    	  conn.close(); 
// 		   }catch (SQLException e) { 
// 		        e.printStackTrace(); 
// 		   } 
// }
//	
//	
//}
//	public static String query(String queryStr){//根据设备号获取对应的设备信息
//		Connection conn=null;
//		Statement stmt =null;
//		String str="";
////    public static void main(String[] args) {  
////	String jDriver = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
////	 String dbURL = "jdbc:sqlserver://localhost:1433;databasename=websocketdata"; // 1433是端口，"USCSecondhandMarketDB"是数据库名称  
////		String userName = "sa"; // 用户名  
////		  String userPwd = "123"; // 密码  
////		String str="";
//		try{
//			Class.forName(jDriver);
//			conn = DriverManager.getConnection(dbURL, userName, userPwd);  
////			String query = "SELECT * FROM data";
//			stmt=conn.createStatement();// 执行SQL语句 
//			ResultSet rs=stmt.executeQuery(queryStr);  
//            while(rs.next()){  
//            	str+="Id:"+rs.getInt(1);
//            	str+="name:"+rs.getString(2);
////                System.out.println(rs.getString("user_name")+":"+rs.getString(2));  
//                //密码字段的编号从1开始，密码排第二位  
//            }  
////            System.out.println("查询数据成功");  
//            rs.close();  
//        }catch(Exception e){  
//            e.printStackTrace();  
//        }  finally{ 
//     	   try { 
//     		      if(stmt != null) 
//     		    	  stmt.close(); 
//     		      if(conn!=null && !conn.isClosed()) 
//     		    	  conn.close(); 
//     		   }catch (SQLException e) { 
//     		        e.printStackTrace(); 
//     		   } 
//     }
////		str="aaaa";
////		System.out.println(str);
//		return str;
//    }  


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