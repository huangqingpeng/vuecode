//创建一个mvvm框架类
//作用：解析页面模版，把相应数据渲染到页面
//import TemplateCompiler from "TemplateCompiler.js"
class MVVM {
    //构造器（创建实例的模版代码）
    constructor(options) {
        this.$vm = this;
        this.$el = options.el;
        this.$data = options.data;

        //判断视图是否存在
        if (this.$el) {
            //创建模版编译器，来解析视图
            new TemplateCompiler(this.$el, this.$vm);
        }
    }


}