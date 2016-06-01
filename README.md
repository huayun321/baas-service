# SENSORO SDK BAAS API


---


轻量级BAAS云前端js接口。
提供向云端指定应用写入任意格式数据的功能。
可使用此API记录活动日志、活动程序。



## 安装：


---
1. 引入SENSORO.js到所要使用的H5页面中。
2. 引入baas.js到所要使用的H5页面中。




## 例子：


---
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<h3>hello !</h3>

<!-- baas client js -->

<script src="/baas_client.js"></script>
<script src="/zepto.min.js"></script>



<script>
    Zepto(function($){

        var baas = SENSORO.baas('bf135b19-9841-4824-9ed4-0d997d613c71', '2e7b64a3-7dc0-4128-95c5-3c00b50c16d8');

        var test_insert = {
            str : 'hahaha',
            num : 1234,
            obj : {hello: 'hello', oobj: {lala: 'lalala'}},
            arr : [{arro: 'arro', arri: [4,5,6]}, [1,2,3]],
            boo : 'boo11'
        };

        baas.create(test_insert, function(err, data) {
            
            return console.log(data);
        });

        baas.get_page({query_key:'str', query_value: 'hello world'}, function(err, data) {
            
            return console.log('get_page, ', data);
        })

    });
</script>

</body>
</html>
```


## 接口：


---

### baas
使用baas api 必须首先调用SENSORO.baas方法，以初始化baas的配置，及使用各接口方法。
```
var baas = SENSORO.baas('bf135b19-9841-4824-9ed4-0d997d613c71', '2e7b64a3-7dc0-4128-95c5-3c00b50c16d8');
```





### baas.create(obj, callback)
创建一条数据。

* callback function(err, data) 创建成功后的回调函数.回调函数的第一个参数err为返回的错误，data为新创建的对象，包含_id。



```
var baas = SENSORO.baas('39ea0ea7-f0ec-49af-a1b2-82c7f3cf5387', '93ce81fe-2604-4c5b-b861-1fb53ce5fb0f');

var test_insert = {
    str : 'hahaha',
    num : 1234,
    obj : {hello: 'hello', oobj: {lala: 'lalala'}},
    arr : [{arro: 'arro', arri: [4,5,6]}, [1,2,3]],
    boo : 'boo11'
};

baas.create(test_insert, function(err, data) {
    if(err) {
        return console.log(err);
    }
    return console.log(data);  
});

//返回的数据格式为
"_id": "1226996f-5d5e-4fe7-8b03-8fd6f7377d6d",
"obj": {
    "str": "hahaha",
    "num": 1234,
    "obj": {
        "hello": "hello",
        "oobj": {
            "lala": "lalala"
        }
    },
    "arr": [
        {
            "arro": "arro",
            "arri": [
                4,
                5,
                6
            ]
        },
        [
            1,
            2,
            3
        ]
    ],
    "boo": "boo11"
},
"create_time": 1464763384232.0
```

### baas.get_page([options,] callback)
分页查询数据。
* options 选填参数。格式为{page_size: 1, current_page:1, query_key: 'str', query_value:'hello'}
* callback function(err, data) 回调，必填。

```
baas.get_page({query_key:'str', query_value: 'hello'}, function(err, data) {
    if(err) {
        return console.log(err);
    }
    return console.log('get_page, ', data);
})



```









