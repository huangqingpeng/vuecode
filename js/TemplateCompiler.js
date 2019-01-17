//TemplateCompiler模版编译器
let TemplateCompiler = class TemplateCompiler {
    //构造函数
    // 1.视图线索
    //  2.全局vm对象
    constructor(el, vm) {
        //缓存重要属性
        this.el = this.isEelementNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        //判断视图存在

        //1.把模版内容放入内存中（片段）
        let fragment = this.nodeTofragment(this.el);
        //2.解析模版
        this.compile(fragment);
        //3.把内存中的结果返回到页面
        this.el.appendChild(fragment);

    }

    /*********工具方法**********/
    isEelementNode(node) {
        //1.元素节点  2.属性节点  3.文本节点
        return node.nodeType === 1
    }
    isTextNode(node) {
        //1.元素节点  2.属性节点  3.文本节点
        return node.nodeType === 3
    }
    toArray(fakeArr) {
        return [].slice.call(fakeArr)
    }

    isDirective(arrName) {
        //判断v-指令
        return arrName.indexOf("v-") >= 0;
    }

    /*******************/


    /**********核心方法*********/
    //把模版放入内存等待解析
    nodeTofragment(node) {
        //1.创建内存片段 2.把模版内容丢到内存3.返回
        let fragment = document.createDocumentFragment();
        let child;
        console.log(node);
        while (child = node.firstChild) {
            fragment.appendChild(child);
        }
        return fragment
    }

    compile(parentNode) {
        //1.获取子节点
        let childNodes = parentNode.childNodes;
        let _this = this;
        //2.遍历每一个子节点
        this.toArray(childNodes).forEach(node => {
            //3.判断节点类型
            if (_this.isEelementNode(node)) {
                //1.元素节点（解析指令）
                _this.compileEelement(node);
                //3.如果还有子节点
                _this.compile(node);
            } else {
                //2.文本节点(表达式解析）
                let textReg = /\{\{(.+)\}\}/;
                let expr = node.textContent;
                console.log(node);
                console.log(textReg.test(expr));
                if (textReg.test(expr)) {
                    expr = RegExp.$1;
                    _this.compileText(node, expr);
                }
            }
            //3.如果还有子节点

        });


    }

    compileEelement(node) {
        //1.获取元素所有的属性
        let attrs = node.attributes;
        let _this = this;
        //2.遍历元素所有的属性
        this.toArray(attrs).forEach(attr => {
            let attrName = attr.name;
            //3.判断属性是否是指令
            if (_this.isDirective(attrName)) {
                //4.收集信息 指令类型 v-text  v-model
                let type = attrName.split("-")[1];
                let expr = attr.value;
                //5.找帮手解析
                CompileUntils[type](node, _this.vm, expr);
            }
        })



    }

    compileText(node, expr) {
        console.log(expr);
        CompileUntils.text(node, this.vm, expr);
    }

    /*******************/

}
CompileUntils = {
    //解析text指令
    text(node, vm, expr) {
        //1.找到更新规则对象的更新方法
        let updaterFn = this.updater.textUpdater;
        if (updaterFn) {
            console.log(vm);
            updaterFn(node, vm.$data[expr]);
        }

        //2.执行方法

    },
    //解析model指令
    model(node, vm, expr) {
        //1.找到更新规则对象的更新方法
        let updaterFn = this.updater.modelUpdater;
        if (updaterFn) {
            console.log(vm);
            updaterFn(node, vm.$data[expr]);
        }

        //2.执行方法

    },
    //更新规则对象
    updater: {
        //文本更新方法
        textUpdater(node, value) {
            console.log(value);
            node.textContent = value;
        },
        //表单更新方法
        modelUpdater(node, value) {
            console.log(value);
            node.value = value;
        }

    }



}


//export default TemplateCompiler