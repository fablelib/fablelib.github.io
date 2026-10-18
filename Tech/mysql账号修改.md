# mysql账号修改


## 1 先进入mysql数据库

mysql通常是没有加到path里面的，所以需要找一下安装路径，一下是默认路径
```
cd "C:\Program Files\MySQL\MySQL Server 5.1\bin"
```




## 2 登录mysql
```
mysql -u root -p
```




## 3 一些检查语句
### 3.1. 看看都有谁（重点看有没有不认识的、host='%' 的）
```
SELECT user, host FROM mysql.user;
+------+-----------+
| user | host      |
+------+-----------+
| root | %         |
| root | localhost |
+------+-----------+
```


%表是root可以从任意ip连进来


### 3.2. 看看有没有 UDF 后门（正常应该是空表）
```
SELECT * FROM mysql.func;

Empty set (0.00 sec)
```

没有就是没问题


### 3.3. 看看文件读取限制（空 = 全盘可读，就是被打的洞）
```
SHOW VARIABLES LIKE 'secure_file_priv';
+------------------+-------+
| Variable_name    | Value |
+------------------+-------+
| secure_file_priv |       |
+------------------+-------+
```

Value 那一列是**空白**，不是 `NULL`、也不是某个路径，意思是：**不限制**。
也就是说 `LOAD_FILE()` 可以读 mysqld 账号有权限读的「任意文件」


### 3.4. 看看 mysqld 跑在哪个账户下
```
SHOW VARIABLES LIKE 'basedir';
+---------------+------------------------------------------+
| Variable_name | Value                                    |
+---------------+------------------------------------------+
| basedir       | C:\Program Files\MySQL\MySQL Server 5.1\ |
+---------------+------------------------------------------+
```

`C:\Program Files\MySQL\MySQL Server 5.1\` 说明确实是 MySQL 5.1，配置文件`my.ini`大概率就在这个目录下


## 4 执行操作

### 4.1 删除test库，删除没意义的库

### 4.2 创建新用户账号，给个增删改查就好了
```
CREATE USER 'dev'@'10.0.%' IDENTIFIED BY '密码'; 
GRANT SELECT, INSERT, UPDATE, DELETE ON `cq%`.* TO 'dev'@'10.0.%';  
CREATE USER 'dev'@'localhost' IDENTIFIED BY '密码';
GRANT SELECT, INSERT, UPDATE, DELETE ON `cq%`.* TO 'dev'@'localhost';
FLUSH PRIVILEGES;
```


补充，漏好多权限： 
```
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, CREATE TEMPORARY TABLES ON `cq%`.* TO 'dev'@'10.0.%';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, CREATE TEMPORARY TABLES ON `cq%`.* TO 'dev'@'localhost';
FLUSH PRIVILEGES;
```


### 4.3 删除远程的root账户
```
DELETE FROM mysql.user WHERE user='root' AND host='%';
FLUSH PRIVILEGES;
```


### 4.4 本地root也改一下密码吧
```
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('新密码');
FLUSH PRIVILEGES;
```


### 4.5 修改`secure_file_priv`，解决mysql读取全盘的问题。

新建一个目录：`C:\MySQLSecure`

然后修改`C:\Program Files\MySQL\MySQL Server 5.1\my.ini`

在`port=3306`下面加多一句：

```
secure_file_priv="C:/MySQLSecure"
```


