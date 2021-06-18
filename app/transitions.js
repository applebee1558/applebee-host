export default function(){
  // Add your transitions here, like:
  //   this.transition(
  //     this.fromRoute('people.index'),
  //     this.toRoute('people.detail'),
  //     this.use('toLeft'),
  //     this.reverse('toRight')
  //   );
    this.transition(
        this.hasClass('liquid-dialog-container'),
        this.use('explode', {
            pick: '.ember-modal-overlay',
            use: ['fade', { maxOpacity: 0.5 }]
        },{
            pick: '.ember-modal-dialog',
            use: ['to-up']
        })
    );
}
