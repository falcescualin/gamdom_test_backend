import { AllowNull, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
  tableName: 'events',
  timestamps: true,
})
export class Event extends Model<Event> {
  @PrimaryKey
  @Column(DataType.UUID)
  event_id!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  event_name!: string;

  @AllowNull(false)
  @Column(DataType.JSONB)
  odds!: { win: number; draw: number; lose: number };
}

export default Event;
