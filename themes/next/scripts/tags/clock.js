/* global hexo */ //console.log()
// content:
/*
		[seconds,]
		{ 								//��		   | ʱ            | ��            | 12Сʱ��        | 24Сʱ��            | ����
			clockFace: 'DailyCounter',  //DailyCounter | HourlyCounter | MinuteCounter | TwelveHourClock | TwentyFourHourClock | Counter
			showSeconds: false,
			callbacks: {	//�ص�����										    
							interval: function() {},		//ˢ��
							init: 	  function() {},		//��ʼ��						
							start: 	  function() {},		//��ʼ��						
							stop:     function() {},        //ֹͣ
							reset:    function() {}         //����							
					   } 		
		}			
*/
// Usage: {% clock class %} Content {% endclock %}



function createClock(args, content) {	
	args = args.join(' ').split(',');
	var id = (args[0]) || 'clock';
	var height = parseInt(args[1]) || 100;
	var width = parseInt(args[2]) || '100%';	
	//var content = args[1];
	//for (var i=2;i<args.length;i++)
	//{
	//   content = content + ',' + args[i];
	//}		
	
	if (content === '') {		
		content = "{ clockFace: 'DailyCounter' }"
	}

	var html = '<div id="'+id+'" class="customFlipClock" style="height: '+height+';width: '+width+'; ">'+content+'</div>';
									  
	return html;
}	
	
hexo.extend.tag.register('clock', createClock, {ends: true});

/* 
	��ʱ��
	$('#id').FlipClock(seconds, { 
									clockFace: 'DailyCounter',
									countdown: false
								}
					   );
 */