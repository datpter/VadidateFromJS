function Validator(options){
 var selectorRulues = {}
 function getParent (element , selector ){
    while( element.parentElement){
        if(element.parentElement.matches( selector)){
            return element.parentElement
        }
        element = element.parentElement
    }
 }
    function vadidate(inputElement,rule){
        var errorElement = getParent(inputElement, options.fromgroupSelector).querySelector(options.formmessageSelector)
        var errorMessage // rule.test(inputElement.value);
        var relus = selectorRulues[rule.selector]

for (var i = 0; i<relus.length;i++){
    errorMessage  = relus[i](inputElement.value)
  
    if(errorMessage) break
}
 
    
        if(errorMessage){
           errorElement.innerText = errorMessage
           getParent(inputElement, options.fromgroupSelector).classList.add('invalid')
        }else{
           errorElement.innerText =''
           getParent(inputElement, options.fromgroupSelector).classList.remove('invalid')
        }
        return ! errorMessage
    }

  var fromElement = document.querySelector(options.from)
  if(fromElement){
    fromElement.onsubmit = function(e){
       e.preventDefault()
       var isFromVlaid = true
       
       options.rules.forEach(function(rule){
        var inputElement = fromElement.querySelector(rule.selector)
      var isVlaid = vadidate(inputElement,rule)
  
      if(!isVlaid){
      isFromVlaid = false
      }
       })
       if(isFromVlaid){
        if( typeof options.onSubmit==='function'){
            var enableInputs = fromElement.querySelectorAll('[name]')
            fromValue = Array.from(enableInputs).reduce(function(value,input){
                 value[input.name]= input.value 
                 return value


            },{})
           
             options.onSubmit(fromValue);
        }
       }
    }
  options.rules.forEach(function(rule){
if(Array.isArray(selectorRulues[rule.selector])){
    selectorRulues[rule.selector].push(rule.test)
}else{
    selectorRulues[rule.selector] = [rule.test]
}
    var inputElement = fromElement.querySelector(rule.selector)
    if(inputElement){
        var errorElement = getParent(inputElement, options.fromgroupSelector).querySelector(options.formmessageSelector)
        inputElement.onblur= function(){
            vadidate(inputElement,rule)
        }
        inputElement.oninput= function(){
           
            errorElement.innerText =''
            getParent(inputElement, options.fromgroupSelector).classList.remove('invalid')
        }
    }
  })

  }


}
Validator.isRequired = function(selector, error){
    return {
        selector: selector,
        test: function(value){
            if(value.trim()){
                return undefined
            }else{
                return  'Mời bạn nhập vào trường này '
            }
      
        }

    }
}
Validator.isEmail = function(selector,error){
    return {
        selector: selector,
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            if(regex.test(value)){
                return undefined
            }else{
                 return  error //|| 'Mời bạn nhập vào email'
            }
        }

    }
}
Validator.minlength = function(selector, min, error){
    return {
        selector: selector,
        test: function(value){
            if(value.length>=min){
              return undefined
            } else{
                return error|| `Mời bạn nhập đúng số lượng ${length}`
            }
        }

    }
}
Validator.isConfirmed= function(selector,  cb){
    return{
        selector:selector,
        test:function(value){
            if(value===cb()){
                return undefined

            }else{
                return'Bạn nhập sai '
            }

        }
    }
}